# Notification system for campsite availabilities

[![Build Status](https://travis-ci.org/tiwatson/wandering-labs-availability-2.svg?branch=master)](https://travis-ci.org/tiwatson/wandering-labs-availability-2)

### Current in development and just about production ready.

In 7 parts. Completely hosted serverless on Amazon AWS using a combination of Lambda, DynamoDB, SNS, S3 and API Gateway.

## api

Collection of lambda functions that handle requests from the angular app. Will be packaged into a single zip and different lambda functions will call a different handler.

#### TODO
- Validation
- updating
- tests
- unpause

## notify

Email notifications to end users

#### TODO
- Uncouple from Reserve America
- Date period ended email
- Twilio SMS ?

## scraper

Scrapers is a lambda function that grabs web pages and parses them for matching campsite availabilities.

#### TODO
- pause request after X amount of availabilites found
- handle errors better

## shared

Collection of code that may be required in the other three parts. DB connection, models.. etc
Included into the other parts codebase via symbolic links created via script in package.json

#### TODO
- User model/repo
- DB envinronment config
- RA subclass
- Validation

## web

Angular web app to allow users to set up an availability request.
Uses middleman ruby gem to allow for haml and sass and easy deployment to S3.

`bundle exec middleman server`

#### TODO
- Non-restrict to Reserve America
- updating

## worker

Worker is a scheduled lambda function that filters the availability requests in the database and sends off SNS notifications for scrapers to be run.

#### TODO


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


##### Priorities

- auto pausing
- alert me on errors. Airbrake?
