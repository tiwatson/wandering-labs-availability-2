# Notification system for campsite availabilities


### No longer in production. See newest code at: https://github.com/tiwatson/reserve.wanderinglabs

In 7 parts. Completely hosted serverless on Amazon AWS using a combination of Lambda, DynamoDB, SNS, S3 and API Gateway.

## api

Collection of lambda functions that handle requests from the angular app. Packaged into a single zip with different lambda functions calling different handler functions.

## notify

Email notifications to end users

## scraper

Scrapers is a lambda function that grabs web pages and parses them for matching campsite availabilities.

## shared

Collection of code that may be required in the other three parts. DB connection, models.. etc
Included into the other parts codebase via symbolic links created via script in package.json

## web

Angular web app to allow users to set up an availability request.
Uses middleman ruby gem to allow for haml and sass and easy deployment to S3.

`bundle exec middleman server`

## worker

Worker is a scheduled lambda function that filters the availability requests in the database and sends off SNS notifications for scrapers to be run.

***

### Helpful info


##### Deploy

Deploys lambda functions.
./deploy.sh {component},{component}

./deploy.sh api,scraper


Amazons DynamoDBLocal app can be used for local development and testing.
```
[~/Development/tools/dynamodb] java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```
