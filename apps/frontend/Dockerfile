FROM node:lts-alpine


# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json /app

# install project dependencies
RUN npm install --production

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY dist/apps/frontend frontend

EXPOSE 8080
CMD [ "http-server", "/app/frontend" ]