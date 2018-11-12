"use strict";

var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const http = require("http");
const socket = require("socket.io");
const mongoose = require("mongoose");

var md = require("markdown-it")(),
  mk = require("markdown-it-katex");

md.use(mk);

var index = require("./routes/index");
var article = require("./routes/article");
var matter = require("./routes/matter");

var app = express();

const server = http.createServer(app);
const io = socket.listen(server);

var port = process.env.PORT || 3000;

app.set("port", port);

mongoose
  .connect("mongodb://localhost:27017/indeeplab")
  .then(result => {
    console.log("Conexión EXITOSA con MongoDB");
    server.listen(port, function() {
      console.log("Servidor corriendo en http://localhost:" + port);
    });
  })
  .catch(err => {
    console.error("Error en la conexión con MongoDB : ", err);
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((request, response, next) => {
  request.io = io;
  next();
});

app.use((request, response, next) => {
  request.md = md;
  next();
});

//ROUTES
app.use("/", index);
app.use("/articulo", article);
app.use("/matter", matter);

// catch 404 and forward to error handler
app.use((request, response, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, request, response, next) => {
  // set locals, only providing error in development
  response.locals.message = err.message;
  response.locals.error = request.app.get("env") === "development" ? err : {};

  // render the error page
  response.status(err.status || 500);
  response.render("error");
});

module.exports = app;
