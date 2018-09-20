'use strict';

var SwaggerExpress = require('swagger-express-mw');
const pathToSwaggerUi = require('./swagger-ui-dist').absolutePath()
var express = require('express');
var app = express();
module.exports = app; // for testing

var config = {
  appRoot: __dirname, // required config,
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err; }
  app.use(express.static(pathToSwaggerUi))

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 3001;
  app.listen(port);

  // if (swaggerExpress.runner.swagger.paths['/hello']) {
  //   console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  // }

  // console.log(swaggerExpress.runner.swagger.paths)
  console.log('started on port: ' + port);

});
