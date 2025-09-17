# Use Node LTS
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Build TS if needed
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "dist/server.js"]
