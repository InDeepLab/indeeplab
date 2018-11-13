"use strict";

var Articles = require("../models/article");

//GET: /
function indexHome(request, response) {
  /**
   * Hacer una consulta de los ultimos 20 registros de articulos
   * y enviarlos mediante socket.io para posteriormente renderizarlos
   */
  request.io.on("connection", socket => {
    Articles.find({})
      .sort({ date: -1 })
      .exec((err, docs) => {
        if (err) return console.error("Error: ", err);
        socket.emit("searchText", false);
        socket.emit("articles", docs);
      });
  });

  /**
   * Renderizar el template index.html y con el componente
   * de search.html
   */
  response.render("index", {
    pageRoutes: ["layout/search"],
    title: "InDeepLab | Blog de divulgación Cientifica",
    scriptJS: ["/socket.io/socket.io.js", "/javascripts/search.js"],
    session: request.session
  });
}

module.exports = {
  indexHome
};
