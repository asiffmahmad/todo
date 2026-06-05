#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Building and pushing multi-architecture Docker image to Docker Hub..."
echo "Target Architectures: linux/amd64 (AWS/Cloud) & linux/arm64 (Mac/ARM)"

# Use buildx to build for both architectures and push directly to Docker Hub
docker buildx build --platform linux/amd64,linux/arm64 -t asiffmahmad/todomain:latest --push .

echo "✅ Successfully pushed to Docker Hub!"
