# Use official Node.js image
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 4567

# Healthcheck: ping /health every 30s
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD sh -c "wget -q -O - http://127.0.0.1:${PORT:-4567}/health > /dev/null || exit 1"

CMD ["npm", "start"]