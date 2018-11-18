"use strict";

module.exports = {
  port: process.env.port || 3000,
  mongodb: process.env.MONGODB || "mongodb://localhost:27017/indeeplab"
};
