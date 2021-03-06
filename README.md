[![Build Status](https://travis-ci.com/vetrosound/people-service.svg?branch=main)](https://travis-ci.com/vetrosound/people-service)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=vetrosound-people-service&metric=alert_status)](https://sonarcloud.io/dashboard?id=vetrosound-people-service)

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Working with docker (docker-compose must be installed)

### Build and Run
`yarn docker:build:run`

### Stop
`yarn docker:stop`
