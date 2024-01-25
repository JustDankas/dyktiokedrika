# Use an official Node.js runtime as a base image
FROM node:16.20.2-buster

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
# RUN npm run build

# Expose the port the app runs on
EXPOSE 4200

# Command to run the application
CMD ["npm", "start"]