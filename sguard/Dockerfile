FROM node:22-slim AS dev
RUN apt-get update && apt-get install -y \
    curl \
    git \
    less \
    sudo \
    unzip \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=development
COPY package.json .
RUN npm install
