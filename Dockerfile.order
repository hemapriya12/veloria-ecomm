FROM node:20-alpine
RUN npm install -g pnpm@9 tsx

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/ packages/
COPY apps/order-service/ apps/order-service/

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/order-service

EXPOSE 8001
CMD ["tsx", "src/index.ts"]
