FROM node:22-alpine
RUN mkdir -p /usr/src/app 
RUN mkdir -p /usr/src/app/views
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY views/* /usr/src/app/views/
COPY server.js /usr/src/app/
RUN npm install
EXPOSE 8099
CMD ["npm", "start"]
