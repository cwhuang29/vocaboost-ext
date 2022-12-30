FROM node:14.18.3
MAINTAINER cwhuang

WORKDIR /app

COPY . .

RUN yarn install
RUN REACT_APP_SERVER_URL=${SERVER_URL} yarn build

ENTRYPOINT ["yarn", "serve"]
