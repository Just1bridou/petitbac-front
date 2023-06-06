FROM node:18.14-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm i -f
COPY . .
CMD [ "npm", "run", "start" ]
