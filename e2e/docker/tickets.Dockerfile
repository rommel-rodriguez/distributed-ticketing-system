FROM node:20.12-alpine

WORKDIR /app

COPY tickets/package.json tickets/package-lock.json ./
RUN npm ci --omit=dev

COPY tickets/ ./

CMD ["npm", "start"]
