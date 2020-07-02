# Glide API

This Glide API was made by Federico Alecci.

# Table Of Contents

- [Glide API](#glide-api)
- [Table Of Contents](#table-of-contents)
  - [API Requirements](#api-requirements)
  - [Setup](#setup)
    - [Requirements](#requirements)
  - [Installing dependencies](#installing-dependencies)
  - [Before running the application](#before-running-the-application)
  - [Running the application](#running-the-application)
  - [Testing](#testing)
  - [Docker](#docker)

## API Requirements

To read about the API requirements, please go to [requirements.md](/requirements.md).

## Setup

### Requirements

**Node**  
[https://nodejs.org/es/](https://nodejs.org/es/) or install using [nvm](https://github.com/nvm-sh/nvm)

**Yarn**  
[https://classic.yarnpkg.com/en/docs/install](https://classic.yarnpkg.com/en/docs/install)

**VSCode** (optional)  
[https://code.visualstudio.com/](https://code.visualstudio.com/) was used for developing this app.

## Installing dependencies

To install the app dependencies, just run `yarn` in the terminal.

## Before running the application

You should configure your `.env` file. There is a `.env.example` file you could use as reference.

## Running the application

To run the application, you could run one of these scripts in your terminal:

- `yarn dev`: this script will watch for app changes and will reload it.
- `yarn start`: this script will just start the application.

If you want to debug the app and you are using VSCode, you code debug with using Node debugger.

The base url will be: `http://localhost:3000/`. You can explore the API accessing to `http://localhost:3000/docs/` :).

## Testing

To run the application tests, just run `yarn test` in the terminal.

## Docker

Optionally, if you have [Docker](https://www.docker.com/) installed, there is a `Dockerfile` you can use to build and run the application:

```
docker build -t glide/api .
docker run -p 3000:3000 glide/api
```
