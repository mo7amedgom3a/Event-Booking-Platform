# Step 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and lock file (use bun or npm depending on what's available, but standard is npm)
# Since bun.lockb is present, we could use bun, but we will use npm for broader compatibility or node image.
COPY package.json package-lock.json* bun.lockb* ./

# Install dependencies (fallback to npm if bun is not used or installed)
# We will use npm here for standard node alpine image.
RUN npm install

# Copy all source files
COPY . .

# Build the project
RUN npm run build

# Step 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output from the previous stage to nginx's serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (default nginx port)
EXPOSE 80

# Configure Nginx to route all requests to index.html (SPA routing)
RUN echo "server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files \$uri \$uri/ /index.html; \
    } \
    }" > /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
