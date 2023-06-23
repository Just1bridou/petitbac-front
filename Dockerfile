FROM node:18.14-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm i -f
COPY . .
RUN npm run build
CMD [ "serve", "-s", "build", "-l", "3000" ]
