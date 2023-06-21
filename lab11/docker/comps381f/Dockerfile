FROM node:4-alpine
COPY server.js /
RUN npm install express
EXPOSE 8099
ENTRYPOINT ["node"]
CMD ["server.js"]
