FROM node:18-alpine
RUN apk add --no-cache bash curl && curl -L https://fly.io/install.sh | sh
WORKDIR /app
COPY . .
#CMD \[ -d "node_modules" \] && npm run dev || npm install && npm run dev
CMD \[ -d "node_modules" \] && npm run start:test || npm install && npm run start:test
