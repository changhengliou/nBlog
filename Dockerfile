FROM node:9.2.0-alpine

ENV NODE_ENV=production INSTALL_PATH=/usr/local/n-blog

RUN mkdir ${INSTALL_PATH} && \
    chown node ${INSTALL_PATH}

WORKDIR ${INSTALL_PATH}

COPY ./package.json .babelrc ./*.js ${INSTALL_PATH}/

COPY app ${INSTALL_PATH}/app

COPY __tests__ ${INSTALL_PATH}/__tests__

RUN yarn install && \
    $(npm bin)/webpack --config=webpack.config.vendor.js --env.prod && \
    $(npm bin)/webpack --config=webpack.config.js --env.prod 

EXPOSE 5000

CMD ["yarn", "run", "dev"]

USER node