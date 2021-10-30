FROM node:14-slim

WORKDIR /usr/src/app

COPY package*.json ./


ARG REACT_APP_FOO
ENV REACT_APP_FOO $REACT_APP_FOO

RUN npm i 

COPY . .

EXPOSE 3000 

CMD [ "npm", "start"]