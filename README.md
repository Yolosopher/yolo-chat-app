# Yolosopher Chat Application

This is a decent chat web application built just for fun, to test my skills and have some practice with the tools used during the development.

As I mentioned the 'tools', here are they:
- Backend(TS): Express
- Frontend: React, ChakraUI
- Database: MongoDB(Mongoose)
- WS: Socket.io
- Auth: JWT(jsonwebtoken)

## Installation

First, clone the github repository:

```
git clone https://github.com/Yolosopher/yolo-chat-app.git
```
Then, cd into the project folder and install the dependencies inside both, ``<root>`` and ``<root>/frontend`` folders:
```
cd yolo-chat-app
```
```
yarn install
```
```
cd frontend
```
```
yarn install
```

## To run the project, you will have to fill `.env` file with valid data.

```sh
PORT=5000
MONGO_URL=
JWT_SECRET_ONE=
```


## build
`run` this command inside again `<root>` and `<root>/frontend` folders:
```sh 
yarn build
```

## run
After building, to start the server on production you can simply add `NODE_ENV=production` inside `.env` file and use

```sh
yarn start 
// or
node ./backend/dist/server.js
```
To start the devServer, you have to run `yarn dev` inside `<root>` folder and `yarn start` inside `<root>/frontend` folder.

##### INFO
It is not a promise, but maybe from time to time I'll be adding new features to this application, depends on my spare time
