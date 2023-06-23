FROM node:18.14-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN yarn
COPY . .

ENV PORT=3000

ENV REACT_APP_BACK_HOST="back.lepetitbac.online"
ENV REACT_APP_BACK_PORT=8080
ENV WDS_SOCKET_PORT=0
ENV REACT_APP_FLAGS="https://countryflagsapi.com/png/"
ENV FAST_REFRESH=true

RUN yarn build
RUN yarn global add serve

CMD [ "serve", "-s", "build" ]
