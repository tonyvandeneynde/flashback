# For setting up a server to serve the image files for local development
# Use the official Nginx image as the base image
FROM nginx:alpine

# Copy the Nginx configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the uploads folder to the container
COPY uploads /usr/share/nginx/html/uploads

# Expose port 80
EXPOSE 80