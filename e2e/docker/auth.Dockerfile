FROM node:20.12-alpine

WORKDIR /app

COPY auth/package.json auth/package-lock.json ./
RUN npm ci --omit=dev

COPY auth/ ./

CMD ["npm", "start"]
