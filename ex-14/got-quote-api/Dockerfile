# -- Base node image with quote api
#
FROM node:18.18.0-alpine3.18 AS base
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN mkdir -p ./controller ./data ./lib ./routes ./src
COPY controller controller
COPY data data
COPY lib lib
COPY routes routes
COPY src src


#
# -- Dependencies
#
FROM base as dependencies
WORKDIR /usr/src/app
RUN npm ci --only=production
RUN cp -R node_modules node_modules_production
# RUN apk add --no-cache make gcc g++ python
RUN npm ci

#
# Running test & stuff
#
# FROM dependencies as test
# WORKDIR /usr/src/app
# #Preparing and runnig tests
# COPY test test
# RUN npm run dtest
##Preparing and running linting
# COPY .eslintrc.json .eslintignore ./
# RUN npm run lint
##Running vulnerability check for dependencies
# RUN npm audit --production --audit-level=high
##Running Snyk
#ARG SNYK_TOKEN
#RUN npm run snyk

#
# Release image
#
FROM base as release
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules_production ./node_modules
RUN addgroup -S -g 1001 apprunner
RUN adduser -S -u 1001 -G apprunner apprunner
USER 1001
EXPOSE 3100
ENTRYPOINT [ "npm", "start"]