FROM node:14

WORKDIR /usr/app

COPY package*.json ./
RUN npm ci -qy

COPY . .

EXPOSE 3333
CMD [ "node", "server.js" ]