FROM node:20.11-alpine3.18

RUN npm install -g pnpm

ENV TZ=America/Lima
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
COPY app /app

RUN pnpm install --prod
RUN pnpm build

RUN rm -rf coverage/ database/ test/ src/ .pnpm-store/ pnpm-lock.yaml tsconfig.build.json tsconfig.json README.md

EXPOSE 80

ENTRYPOINT pnpm start:prod
