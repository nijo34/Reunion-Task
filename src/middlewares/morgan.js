const  morgan = require('morgan')
const Logger = require('../logger/logger')

var stream = {
    write: function (message) { return Logger.http(message); },
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
  };

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms", 
  { stream, skip }
);

module.exports = morganMiddleware;