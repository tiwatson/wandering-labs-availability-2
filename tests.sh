#/usr/bin/env/sh
set -e
DIR="$( cd "$( dirname "$0" )" && pwd )"

components="notify shared scraper/scrapers scraper/worker"

for component in $components
do
    echo "Testing component: $component"
    cd $component
    npm install
    npm test
    cd $DIR
done
