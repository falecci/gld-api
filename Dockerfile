FROM node:12.10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install

COPY . /usr/src/app
RUN yarn build

ENV NODE_ENV docker

EXPOSE 3000

CMD [ "yarn", "start" ]