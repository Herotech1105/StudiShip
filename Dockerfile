FROM node:latest

WORKDIR /user/src/app
COPY package.json ./

RUN npm install

ENV DATABASE="webapp"
ENV DATABASE_HOST="localhost"
ENV DATABASE_USER="webapp"
ENV DATABASE_PASSWORD="webapp"

COPY . .
EXPOSE 5000
CMD [ "node", "controller.js"]