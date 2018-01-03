FROM node:9.2.0-alpine

RUN { \
		echo '#!/bin/sh'; \
		echo 'set -e'; \
		echo; \
		echo 'dirname "$(dirname "$(readlink -f "$(which javac || which java)")")"'; \
	} > /usr/local/bin/docker-java-home \
	&& chmod +x /usr/local/bin/docker-java-home

ENV NODE_ENV=production \
    INSTALL_PATH=/usr/local/n-blog \ 
    JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk \
    PATH=$PATH:/usr/lib/jvm/java-1.8-openjdk/jre/bin:/usr/lib/jvm/java-1.8-openjdk/bin \
    JAVA_VERSION=8u131 \
    JAVA_ALPINE_VERSION=8.131.11-r2

RUN set -x && \
    apk add --no-cache \
		openjdk8="$JAVA_ALPINE_VERSION" && \
	[ "$JAVA_HOME" = "$(docker-java-home)" ] && \
    mkdir ${INSTALL_PATH} && \
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