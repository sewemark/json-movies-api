FROM node:12-slim

EXPOSE 8888

WORKDIR /node

COPY package*.json ./

RUN mkdir app && chown -R node:node .

USER node

RUN npm install && npm cache clean --force

WORKDIR /node/app

COPY --chown=node:node . .
