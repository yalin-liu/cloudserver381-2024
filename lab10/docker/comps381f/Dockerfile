# Creates a layer from the docker image
FROM node:4-alpine

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
