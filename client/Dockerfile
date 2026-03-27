FROM node:alpine
LABEL maintainer="rommelrodperez@gmail.com"
LABEL org.opencontainers.image.source="https://github.com/rommel-rodriguez/distributed-ticketing-system/"

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]