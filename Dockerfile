# Stage 1
FROM node:18-alpine as node

WORKDIR /app
COPY package* .
RUN npm install
COPY . .
RUN npm run build:prod
# Stage 2
FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/beta-blog /usr/share/nginx/html
