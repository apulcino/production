FROM node:8
WORKDIR /usr/src/apigateway
COPY package*.json ./
RUN npm install
RUN cd ./library; npm install
COPY . /usr/src/apigateway
CMD ["node", "server.js"]
EXPOSE 8080