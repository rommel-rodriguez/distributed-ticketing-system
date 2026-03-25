FROM node:20.12-alpine 
LABEL maintainer="rommelrodperez@gmail.com"
LABEL org.opencontainers.image.source="https://github.com/rommel-rodriguez/distributed-ticketing-system/"

WORKDIR /app

COPY package.json ./ 

RUN npm install --omit=dev

COPY ./ ./ 

CMD [ "npm", "start" ]