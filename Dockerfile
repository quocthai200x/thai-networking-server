# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/server

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the server application code into the container
COPY . .

# Expose the port your server listens on (replace 3000 with your actual port)
EXPOSE 5555

# Command to start your server application
CMD ["node", "index.js"]