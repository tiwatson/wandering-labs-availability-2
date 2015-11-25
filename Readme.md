# Notification system for campsite availabilities

### Current in development and not production ready.

In 4 parts. To be completely hosted serverless on Amazon AWS using a combination of Lambda, DynamoDB, SNS, S3 and API Gateway.

## api

Collection of lambda functions that handle requests from the angular app. Will be packaged into a single zip and different lambda functions will call a different handler.

#### TODO
- Validation
- Cancelation
- User review
- updating

## scraper

Scrapers and worker.

Scrapers is a lambda function (1 for each provider, currently only Reserve America) that grabs web pages and parses them for matching campsite availabilities.

Worker is a scheduled lambda function that filters the availability requests in the database and sends off SNS notifications for scrapers to be run.

#### TODO
- lambda integration
- SNS
- blocks of X (run syncron)
- email notifications (this the proper spot for them?!?)

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

#### TODO
- Non-restrict to Reserve America
- Validation
- Cancelation
- User review
- updating


***

### Helpful info

Amazons DynamoDBLocal app can be used for local development and testing.
```
[~/Development/tools/dynamodb] java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```
