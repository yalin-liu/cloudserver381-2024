# Docker Compose
[Docker Compose](https://docs.docker.com/compose/) is a tool for defining and running multi-container Docker applications. With Compose, you use a `YAML` file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.

This tutorial demonstrates how to deploy a multi-container app written using Express.js, Passport.js and MongoDB.  Two containers are used to deploy this app.  The first container bundles everything needed to run the app (which listens for HTTP requests at port `8099`).  The second container runs a MongoDB server used by the app running in the first container. 

## Preparation
1. [Install docker-compose](https://docs.docker.com/compose/install/)
1. Replace the values of `facebookAuth.clientID` and `facebookAuth.clientSecret` in [server.js](server.js) with a valid [Facebook App ID and App Secret](https://github.com/raymondwcs/oauth).

## Steps
1. Run the following command to build and run two docker container images (`booking_app` and `mongo`).
```
docker-compose up -d
```
2. Run the app by opening `localhost:8099` in your web browser.
3. Shutdown the containers when you're done.
```
docker-compose down
```
