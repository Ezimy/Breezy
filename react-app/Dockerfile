# Use Node.js as the base image for building
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies separately for better caching
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app's files and build the React app
COPY . . 
RUN npm run build

# Use Nginx to serve the built React app
FROM nginx:alpine

# Set working directory for Nginx
WORKDIR /usr/share/nginx/html

# Copy the build folder to Nginx's default web directory
COPY --from=builder /app/dist .

# Remove default Nginx config and replace with a custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the correct Cloud Run port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]