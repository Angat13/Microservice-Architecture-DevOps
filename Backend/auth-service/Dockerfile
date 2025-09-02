FROM node:18-alpine

WORKDIR /app

# Copy only dependency files first (for better build caching)
COPY package*.json ./

RUN npm install --production

# Copy the rest of the source code
COPY . .

EXPOSE 5000
CMD ["node", "index.js"]
