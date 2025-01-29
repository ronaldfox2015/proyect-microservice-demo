FROM node:20.11-alpine3.18

RUN apk update && \
    apk upgrade && \
    apk add --no-cache git && \
    npm install -g pnpm && \
    apk add procps


ENV TZ=America/Lima
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /app
# Instala el CLI de NestJS globalmente
RUN npm install -g @nestjs/cli
RUN nest --version
EXPOSE 80
