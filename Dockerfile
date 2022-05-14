FROM node:lts-alpine
WORKDIR /app
COPY package*.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ];\
        then npm install; \
        else npm install --only=production; \
        fi
# copies everything from our directory into docker container
COPY . ./
EXPOSE 5000
USER node
# Does not matter what has been set in CMD, it will get overided.
CMD ["node","main.js"] 


# Note
# Don't copy node_modules file
# Don't copy Dockerfile , .env file
# Don't copy .git and .gitignore