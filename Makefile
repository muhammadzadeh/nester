NODE_BIN_PATH := $(abspath node_modules/.bin)
TYPEORM := node ./node_modules/typeorm/cli.js
TYPEORM_CFG := -d dist/typeorm-config
TS_SRC = $(shell find ./src -type f -name '*.ts')

WATCH ?= true
DEBUG ?= false

node_modules/.bin:
	npm ci

node_modules: node_modules/.bin ## Install NPM dependecies

dist: $(TS_SRC) node_modules
	rm -rf dist
	$(NODE_BIN_PATH)/nest build $(if $(filter-out "test","$(NODE_ENV)"),,-p tsconfig.test.json)

.lint:
	$(NODE_BIN_PATH)/eslint "src/**/*.ts" $(if $(FIX),--fix,)

.style:
	$(NODE_BIN_PATH)/prettier $(if $(FIX),--write,-c) "src/**/*.ts"

.format: dist .lint .style

fix: FIX=1
fix: .format ## Fix lint issues

check: .format ## Check for lint issues

check-migration: export NODE_ENV=test
check-migration: db-upgrade ## Check for remaining migrations
	$(TYPEORM) migration:generate -n "missing_migration" $(TYPEORM_CFG) > /dev/null 2>&1 && ( \
		echo "missing migration found!" && \
		cat "src/migration/$$(ls src/migration | tail -1)" \
	) && exit 1 || true

run: node_modules ## Run app
	$(NODE_BIN_PATH)/nest start $(if $(WATCH),--watch,) $(if $(debug),--debug,)

build: dist ## Compile and Build Project

db-drop: dist ## Drop all tables
	$(TYPEORM) schema:drop $(TYPEORM_CFG)

db-upgrade: dist ## Run all migrations
	$(TYPEORM) migration:run $(TYPEORM_CFG)

db-generate: dist ## Generate a new migration ($NAME -> name of migration file)
	npm run typeorm -- migration:generate src/migration/$(NAME) $(TYPEORM_CFG)
	
db-refresh: db-drop db-upgrade ## Refresh (drop and migrate) database

typeorm: dist ## Run Typeorm cli ($CMD -> subcommand of typeorm cli)
	$(TYPEORM) $(CMD) $(TYPEORM_CFG)

.coverage-cleanup:
	rm -rf coverage

test: export NODE_ENV=test
test: .coverage-cleanup ## Run all tests ($TEST_ARGS -> jest extra arguemnts)
	node -r tsconfig-paths/register ./node_modules/.bin/typeorm-ts-node-commonjs schema:drop -d src/typeorm-config
	node -r tsconfig-paths/register ./node_modules/.bin/typeorm-ts-node-commonjs schema:sync -d src/typeorm-config
	$(NODE_BIN_PATH)/jest --testMatch='**/*.spec.ts' --passWithNoTests $(if $(PKG), src/$(PKG),) $(if $(COVERAGE), --collectCoverage --collectCoverageFrom='$(PKG)/**/*.ts',) $(TEST_ARGS)

.PHONY: build test db-refresh db-drop db-upgrade fix check run serve typeorm test .coverage-cleanup

clean:
	rm -rf dist node_modules

.PHONY: help
.DEFAULT_GOAL := help

help:
	@for i in $(MAKEFILE_LIST); do grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $$i | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}';done

