FROM node:22-alpine

WORKDIR /app

COPY bakalarska-prace/package*.json ./
RUN npm ci

COPY bakalarska-prace/ ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]