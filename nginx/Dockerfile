FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 và 443
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
