
FROM node:8
WORKDIR /usr/src
COPY ./package.json /usr/src/afoevents/
COPY ./package-lock.json /usr/src/afoevents/
COPY . /usr/src/afoevents/
COPY ./config /usr/src/config/
RUN cd /usr/src/afoevents; npm install
RUN cd /usr/src/afoevents/library; npm install
RUN cd .. && cd ..
CMD ["node", "./afoevents/server.js"]
EXPOSE 8100

