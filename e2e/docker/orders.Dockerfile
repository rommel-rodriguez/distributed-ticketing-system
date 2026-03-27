FROM node:20.12-alpine

WORKDIR /app

COPY orders/package.json orders/package-lock.json ./
RUN npm ci --omit=dev

COPY orders/ ./

CMD ["npm", "start"]
