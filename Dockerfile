FROM node:18-alpine

# Cài đặt múi giờ và cấu hình
RUN apk add --no-cache tzdata

# Cấu hình múi giờ cho container
ENV TZ=Asia/Ho_Chi_Minh

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

RUN ln -snf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime && echo "Asia/Ho_Chi_Minh" > /etc/timezone

# Start the application in debug mode
CMD ["npm", "run", "start:debug"]
