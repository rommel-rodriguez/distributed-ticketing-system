FROM node:20.12-alpine 
LABEL maintainer="alrodperez@gmail.com"

WORKDIR /app

COPY package.json ./ 

RUN npm install

COPY ./ ./ 

CMD [ "npm", "start" ]