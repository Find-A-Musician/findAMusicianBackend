FROM node:lts

ENV NODE_VERSION 16.2.0

WORKDIR /app

COPY ./package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD npm start

