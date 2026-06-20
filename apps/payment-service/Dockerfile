FROM node:20-alpine
RUN npm install -g pnpm@9 tsx

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/ packages/
COPY apps/payment-service/ apps/payment-service/

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/payment-service

EXPOSE 8002
CMD ["tsx", "src/index.ts"]
