FROM node:18.14-alpine
# ENV REACT_APP_BACK=""
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD [ "npm", "run", "start" ]
