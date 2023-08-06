FROM node:18.12-alpine3.16 AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY tsconfig.json .
COPY prisma prisma
COPY src src

RUN npx prisma generate
RUN npm run build


FROM node:18.12-alpine3.16 AS app

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY .env .

RUN npm ci --production

COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/dist dist

RUN node dist/deploy-commands.js

ENTRYPOINT ["npm", "run"]

CMD ["start:prod"]
