FROM node:20.12-alpine 
LABEL maintainer="alrodperez@gmail.com"

WORKDIR /app

COPY package.json ./ 

RUN npm install --omit=dev

COPY ./ ./ 

CMD [ "npm", "start" ]