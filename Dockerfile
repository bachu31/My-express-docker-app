FROM node:18-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

EXPOSE 3000
CMD ["npm","start"]