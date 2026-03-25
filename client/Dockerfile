FROM node:alpine
LABEL maintainer=" rommelrodperez@gmail.com"

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]