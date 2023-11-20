# COMPS381F - Container Virtualization Using Docker
## Introduction
This tutorial demonstrates how you run an express.js server, which requires an older version of Node (version 4), using container virtualization.  

## Steps
1. Run `server.js`. Make a note of the version of Node being used.
3. Register at [Docker Hub](https://hub.docker.com) and obtain your Docker User ID (`your-docker-id`).
3. Build a *container image*
   ```
   docker build -t "your-docker-id/oldnodejs" .
   ```
4. Check your container image.
   ```
   docker images
   ```
5. Run your container.
   ```
   docker run -d -p 8099:8099 your-docker-id/oldnodejs
   ```
6. Verify your container is running.
   ```
   docker ps
   ```
7. Open `localhost:8099` in your Web broswer.
8. Which version of Node is being used now?
9. Share your container image by uploading it to Docker Hub
   ```
   docker login
   docker push your-docker-id/oldnodejs
   ```
## Notes
The following diagram summarizes what you have acheived in this tutorial.

![Docker Container](DockerContainer.png)
