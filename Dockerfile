FROM node:20-alpine as build

WORKDIR /home/app

COPY package*.json ./
RUN npm i
COPY . .
RUN mv .env .env

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]