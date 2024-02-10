#!/bin/sh

cp -r ./data ./dist/data
node dist/scripts.js seed_old_users_to_db_script --state test --token i_know_what_i_am_doing
node dist/scripts.js seed_old_community_to_db