FROM node:22-slim AS dev
RUN apt-get update && apt-get install -y \
    curl \
    git \
    less \
    sudo \
    unzip \
    && rm -rf /var/lib/apt/lists/*
ADD https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip ./awscliv2.zip
RUN unzip awscliv2.zip \
    && ./aws/install --bin-dir /usr/local/bin --install-dir /usr/local/aws-cli --update \
    && curl -so- https://raw.githubusercontent.com/realfabecker/kevin/master/install.sh | bash \
    && chmod +x /root/bin/kevin \
    && mv /root/bin/kevin /usr/local/bin/kevin \
    && userdel node \
    && addgroup nonroot --gid 1000 \
    && adduser --uid 1000 --gid 1000 nonroot
USER nonroot
WORKDIR /home/nonroot/app
ENV NODE_ENV=development
COPY package.json .
RUN npm install

FROM node:22-slim AS build
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim AS prod
COPY --from=build /app/build .
COPY --from=build /app/build.info .
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .
ENV NODE_ENV=production
CMD ["npm", "run", "start"]