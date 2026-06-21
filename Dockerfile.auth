FROM node:20-alpine
RUN npm install -g pnpm@9 tsx

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/ packages/
COPY apps/auth-service/ apps/auth-service/

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/auth-service

EXPOSE 8003
CMD ["tsx", "src/index.ts"]
