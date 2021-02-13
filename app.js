'use strict';
const dotenv = require("dotenv");
dotenv.config();

const SwaggerExpress = require('swagger-express-mw');
const swaggerTools = require('swagger-tools');
const pathToSwaggerUi = require('./swagger-ui-dist').absolutePath()
const express = require('express');
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");

const app = express();
module.exports = app; // for testing


app.use(morgan("dev")); // logger
app.use(passport.initialize()); // init passport

const strategy = require("./passport").passportStrategy;
strategy(passport); // use the passport strategy we defined

const config = {
  appRoot: __dirname, // required config,
  swaggerSecurityHandlers: {
    jwt_token: (req, authOrSecDef, scopes, callback) => {
        console.log('asasdsa')
    }
  }
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err; }
  // console.log(swaggerExpress)
  app.use(express.static(pathToSwaggerUi))
  swaggerExpress.register(app);
  
  mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true }
    );

  const port = process.env.PORT || 3001;
  app.listen(port);

  console.log('started on port: ' + port);

});

// swaggerTools.initializeMiddleware(config, function (middleware) {
//   // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
//   // app.use(middleware.swaggerMetadata());

//   // Validate Swagger requests
//   // app.use(middleware.swaggerValidator());

//   // Route validated requests to appropriate controller
//   // app.use(middleware.swaggerRouter(options));

//   // Serve the Swagger documents and Swagger UI
//   // app.use(middleware.swaggerUi());
//   mongoose.connect(
//     process.env.MONGO_URL,
//     { useNewUrlParser: true }
//   );

//   const port = process.env.PORT || 3001;
//   // Start the server
//   http.createServer(app).listen(port, function () {
//     console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
//   });
// });