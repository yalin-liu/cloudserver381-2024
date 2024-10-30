# Creates a layer from the docker image
FROM node:22-alpine
# node:<version>-alpine, this image is based on the popular Alpine Linux project, available in the alpine official image. 
# Alpine Linux is much smaller than most distribution base images (~5MB), and thus leads to much slimmer images in general.

WORKDIR /usr/app

# Copy the local directory file to the Docker client’s current directory
COPY ./ .

# Execute the command when building image
RUN npm install && pwd

# Declare the container is listening on which port
EXPOSE 8099

# Specifies the command to run when the container starts
ENTRYPOINT ["node"]

# Specify the default command when creating the container
CMD ["server.js"]
