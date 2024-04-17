# Stage 1: Installer
FROM node:13-alpine3.11 AS installer

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install --production

# Stage 2: Final Image
FROM node:13-alpine3.11

RUN mkdir /app
WORKDIR /app

COPY --from=installer /app .

COPY index.js /app/

EXPOSE 8082

CMD ["npm", "start"]
