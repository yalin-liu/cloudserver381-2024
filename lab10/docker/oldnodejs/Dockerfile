# Creates a layer from the docker image
# specify the node base image with your desired version: node:<version>
FROM node:4-alpine
# node:<version>-alpine, this image is based on the popular Alpine Linux project, available in the alpine official image. 
# Alpine Linux is much smaller than most distribution base images (~5MB), and thus leads to much slimmer images in general.


# Copy the local directory file to the Docker client’s current directory
COPY server.js /

# Execute the command when building image
RUN npm install express

# Declare the container is listening on which port
EXPOSE 8099

# Specifies the command to run when the container starts
ENTRYPOINT ["node"]

# Specify the default command when creating the container
CMD ["server.js"]
