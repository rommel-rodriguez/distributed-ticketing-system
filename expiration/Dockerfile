FROM node:20.12-alpine 
LABEL maintainer="rommelrodperez@gmail.com"

WORKDIR /app

COPY package.json ./ 

RUN npm install --omit=dev

COPY ./ ./ 

CMD [ "npm", "start" ]