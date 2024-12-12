FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /var/www

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application (optional, depending on your app structure)
RUN npm run build

# Run migrations (optional, if needed)
RUN npm run typeorm:migration:run

# Start the application in debug mode
CMD ["npm", "run", "start:debug"]
