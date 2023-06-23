FROM node:18.14-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm i -f
COPY . .
RUN npm run build
RUN npm i -g serve

ENV PORT=3000
ENV REACT_APP_BACK_HOST="back.lepetitbac.online"
ENV REACT_APP_BACK_PORT=8080
ENV WDS_SOCKET_PORT=8080
ENV REACT_APP_FLAGS= 'https://countryflagsapi.com/png/'
ENV FAST_REFRESH=true

CMD [ "serve", "-s", "build" ]
