FROM node:18-alpine3.15

RUN apk add --no-cache --virtual .gyp python2 make g++

RUN yarn config set python $(which python2)

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json yarn.lock ./

COPY --chown=node:node . .

USER node

RUN rm -rf node_modules && yarn install --pure-lockfile

EXPOSE 6060

CMD ["yarn", "start"]
