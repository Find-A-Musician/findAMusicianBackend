FROM node:14-alpine

WORKDIR /app

COPY ./package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8000

RUN npm start

