# Use an official Node.js runtime as the base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your backend runs on
EXPOSE 8080

# Start the backend server
CMD ["node", "index.js"]