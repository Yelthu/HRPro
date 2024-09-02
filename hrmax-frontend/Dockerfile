# Development Stage
FROM  node:16.20.2-alpine as development

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

CMD [ "yarn", "start" ]

# Production Stage
FROM  nginx:1.27.1-alpine as production

#WORKDIR /app

COPY --from=development /app/build /usr/share/nginx/html

#RUN yarn install --frozen-lockfile

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]