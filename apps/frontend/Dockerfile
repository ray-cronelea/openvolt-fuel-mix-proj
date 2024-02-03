FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /app
COPY package*.json /app
RUN npm install --production
COPY dist/apps/frontend frontend
EXPOSE 8080
CMD [ "http-server", "/app/frontend" ]
