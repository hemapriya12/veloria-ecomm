FROM node:20-alpine
RUN npm install -g pnpm@9 tsx

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/ packages/
COPY apps/product-service/ apps/product-service/

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/product-service

EXPOSE 8000
CMD ["tsx", "src/index.ts"]
