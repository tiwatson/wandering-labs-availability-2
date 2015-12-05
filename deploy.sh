#/usr/bin/env/sh
set -e

echo $@

cd deploy
DEPLOY="$@" npm start
