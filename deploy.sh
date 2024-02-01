echo "Running deploy script"
rm -rf dist
nx run backend:build:production
nx run frontend:build:production
nx run backend:docker-build:production
nx run frontend:docker-build:production