FROM node:14-slim

WORKDIR /usr/src/app

COPY package*.json ./

ARG REACT_APP_ENV
ENV REACT_APP_ENV $REACT_APP_ENV

RUN npm i 

COPY . .

EXPOSE 3000 

CMD [ "npm", "start"]