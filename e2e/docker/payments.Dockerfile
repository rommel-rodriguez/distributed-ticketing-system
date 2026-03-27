FROM node:20.12-alpine

WORKDIR /app

COPY payments/package.json payments/package-lock.json ./
RUN npm ci --omit=dev

COPY payments/ ./

CMD ["npm", "start"]
