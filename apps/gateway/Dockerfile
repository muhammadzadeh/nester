FROM node:lts-bullseye-slim AS builder
    
USER root

WORKDIR /app

RUN chown node:node .

USER node

COPY --chown=node:node ["package.json", "package-lock.json", "./"]

RUN set -x && \
  NODE_ENV=production npm ci && \
  mv node_modules /tmp && \
  npm ci && \
  rm -rf /home/node/.cache

COPY --chown=node:node . .

RUN npm run build

#FROM gcr.io/distroless/nodejs AS runner
FROM node:lts-bullseye-slim AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/deployments/config.yml ./config.yml
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /tmp/node_modules ./node_modules

CMD ["dist/main"]

EXPOSE 80
