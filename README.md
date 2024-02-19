# Getting Started

This accounting software is a product of Dealway and is available on Dealway.com

## Self-hosted 

Dealway Accounting can be hosted on your servers using Docker.

### Docker

To get started with self-hosted with Docker and Docker Compose, follow these commands:

1. **Download the required files:**

    ```
    git clone --depth 1 -b main [Github repo link]
    cd ./dealway-accounting
    ```

2. **Configure the .env file:**

    ```
    cp .env.example .env
    nano .env
    ```

    Change all mail variables to configure it with your mail server and the password of databases.

3. **Get the services up and running:**

    ```
    docker-compose --file docker-compose.prod.yml up -d
    ```

    When the installation is complete, run this command:

    ```
    docker ps
    ```

4. **Changing .env after docker is up:**

    For production build:

    ```
    docker-compose --file docker-compose.prod.yml restart
    ```

    OR

    For development build:

    ```
    docker-compose restart
    ```

## Development

### Local Setup

To get started locally, follow these steps:

1. **Local Setup Prerequisites:**

    The application currently supports Node.js v18.x.

    pnpm packages manager, (from pnpm guide pick any installation method).

2. **Running the backend:**

    ```
    cd ./dealway-accounting
    pnpm install
    docker-compose up -d
    pnpm run build:server
    node packages/server/build/commands.js system:migrate:latest
    pnpm run dev:server
    ```

3. **Running the frontend:**

    ```
    pnpm run dev:webapp
    ```
