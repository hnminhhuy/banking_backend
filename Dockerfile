# Use Node.js 20 Alpine image
FROM node:20-alpine

WORKDIR /var/www



CMD ["npm run migration:run && npm run start:debug"]
