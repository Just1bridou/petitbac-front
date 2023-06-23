FROM node:18.14-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm i -f
COPY . .
RUN npm run build
RUN npm i -g serve
ENV PORT=3000
CMD [ "serve", "-s", "build" ]
