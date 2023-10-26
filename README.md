# Random Cats API

![OK cat](docs/images/200.jpg "OK cat")

This is a REST API in NestJS where you can:

- Create a cat
- Rate a cat
- Fetch all cats
- Fetch a random cat
- Import a list of cats from a url into the DB

Extra features:

- API Key authentication
- AWS S3 integration

## Tech

- NestJS
- TypeScript
- PostgreSQL
- Docker
- Localstack (For local AWS S3 support)

## Installation

```bash
$ npm i
```

## Running the project

1) Copy the .sample.env file to a .env file and set your API_KEY value there
2) Start the containers:

```bash
$ docker compose -f ./resources/docker-compose.yml up 
```

3) Start the API:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Documentation

### Compodoc

You can have a good overview about the project by running Compodoc:

```bash
$ npm run compodoc
```

This will generate a directory called "documentation" with several files, so you can open the index.html file on your browser.

### Postman collection

A [Postman](https://www.postman.com/downloads/) collection can be found inside of the docs directory. You can just import it to Postman and start using it to interact with the API.
