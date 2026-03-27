FROM node:20.12-alpine

WORKDIR /app

COPY expiration/package.json expiration/package-lock.json ./
RUN npm ci --omit=dev

COPY expiration/ ./

CMD ["npm", "start"]
