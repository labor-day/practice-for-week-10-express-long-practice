const express = require('express');
require('express-async-errors');  //async error handler
const app = express();

//logger middleware
app.use((req, res, next) => {
  console.log("Request method", req.method);
  console.log("Request url", req.url);
  next();
});

//serve assets under static resource
app.use('/static', express.static("assets"));

//parse all incoming request bodies as json
app.use(express.json());

//routers
const dogRouter = require('./routes/dogs');
app.use('/dogs', dogRouter);

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

//resource not found
app.use((req, res, next) => {
  let error = new Error("The requested resource could not be found.");
  error.statusCode = 405;
  next(error);
});

//error logger
app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500;
  resBody = {
    message: err.message || "Something went wrong",
    statusCode: res.statusCode || 500,
  }
  if (environment === "DEVELOPMENT") {
    resBody.stack = err.stack;
  }
  res.json(resBody);
});

const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || "PRODUCTION";
app.listen(port, () => {
  console.log('Server is listening on port', port);
  console.log('Environment: ', environment);
});
