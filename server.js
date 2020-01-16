const express = require('express');
const helmet = require('helmet');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');
const cors = require('cors');
const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl} TimeStamp: ${new Date().toISOString()}`)
  next();
}

server.use(express.json());
server.use(cors())
server.use(helmet())
server.use(logger)
server.use('/api/user', userRouter)
server.use('/api/posts', postRouter)

module.exports = server;
