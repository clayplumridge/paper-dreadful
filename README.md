# Paper Dreadful

[![Node.js CI](https://github.com/clayplumridge/paper-dreadful/actions/workflows/ci.yaml/badge.svg)](https://github.com/clayplumridge/paper-dreadful/actions/workflows/ci.yaml)

## Getting Started (Windows)

1. Install [Node Version Manager](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)

### Powershell

1. Open VSCode as Administrator
2. Open a Powershell terminal session

#### Setup NodeJs

1. Run `nvm install 23`
2. Run `nvm use 23`
3. Verify success by running `node -v`

#### Setup yarn

1. Run `Set-ExecutionPolicy Unrestricted`
2. Run `corepack enable`
3. Run `yarn`

#### Setup MySQL

1. Install [MySQL Workbench](https://dev.mysql.com/doc/workbench/en/wb-installing-windows.html)
2. Start the `MySQL80` Windows service. You may want to configure it to start with your computer by changing `Startup Type` to `Automatic`.
3. Open MySQL Workbench and create a new database called `paperdreadful`.

#### Configure .env

1. Make a copy of `packages/server/empty.env` and rename it to `.env`
2. Fill out your database settings with your local username and password.
3. Get the `GOOGLE_OAUTH_SECRET` from Clay.

#### Start the application

1. Run `yarn start:dev`
2. Open your browser and navigate to `localhost:1234`.
