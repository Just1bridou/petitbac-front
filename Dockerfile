FROM node:18.14-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm i -f
RUN npm run build
COPY . .
CMD [ "serve", "-s", "build", "-l", "3000" ]
