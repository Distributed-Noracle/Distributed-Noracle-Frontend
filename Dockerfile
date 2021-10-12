# Stage 1
FROM node:14-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Note the first -- separator, used to separate the params passed to npm command itself, and the params passed to the "script".
RUN npm run build -- --configuration production

# Stage 2
FROM nginx:1.19-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf