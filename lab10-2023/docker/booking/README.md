# Docker Compose

[Docker Compose](https://docs.docker.com/compose/) is a tool for defining and running multi-container Docker applications. With Compose, you use a `YAML` file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.

This tutorial demonstrates how to deploy a multi-container app written using Express.js, Passport.js and MongoDB.  Two containers are used to deploy this app.  The first container bundles everything needed to run the app (which listens for HTTP requests at port `8099`).  The second container runs a MongoDB server used by the app running in the first container.

## Preparation

1. [Install docker-compose](https://docs.docker.com/compose/install/)
2. Replace the values of `facebookAuth.clientID` and `facebookAuth.clientSecret` in [server.js](server.js) with a valid [Facebook App ID and App Secret](https://github.com/raymondwcs/oauth).

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

## References
1. [連接containerized Mongo Express到既有MongoDB](https://medium.com/norsys-octogone/a-local-environment-for-mongodb-with-docker-compose-ba52445b93ed)

2. [連接containerized Mongo Express到既有MongoDB](https://medium.com/@brayce1996/%E9%80%A3%E6%8E%A5containerized-mongo-express%E5%88%B0%E6%97%A2%E6%9C%89mongodb-3a34531bbdec)

3. [Docker hub - mongo-express official website](https://hub.docker.com/_/mongo-express)

4. [docker-compose 中 network_mode 设置导致无法从容器外部访问 MySQL](https://win-man.github.io/2020/02/03/docker-compost-network-mode-mysql-connect/)

5. https://codefresh.io/docs/docs/example-catalog/ci-examples/import-data-to-mongodb/