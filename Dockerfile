FROM node:18.12-alpine3.16 AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY src src
COPY tsconfig.json .

RUN npm run build


FROM node:18.12-alpine3.16 AS app

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY .env .

RUN npm install --omit=dev

COPY --from=builder /app/dist dist

ENTRYPOINT ["npm", "run"]

CMD ["start:prod"]
