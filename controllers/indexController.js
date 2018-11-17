"use strict";

var Articles = require("../models/article");

//GET: /
function indexHome(request, response) {
  var queryArticle = [
    {
      $lookup: {
        from: "authors",
        localField: "author",
        foreignField: "_id",
        as: "author"
      }
    },
    {
      $sort: {
        date: -1
      }
    },
    {
      $limit: 2
    }
  ];
  /**
   * Hacer una consulta de los ultimos 20 registros de articulos
   * y enviarlos mediante socket.io para posteriormente renderizarlos
   */
  request.io.once("connection", socket => {
    Articles.aggregate(queryArticle, (err, docs) => {
      if (err) return console.error("Error: ", err);
      console.log(docs.length);
      socket.emit("articles", docs);
    });
  });

  /**
   * Renderizar el template index.html y con el componente
   * de search.html
   */
  response.render("index", {
    pageRoutes: ["layout/home"],
    title: "InDeepLab | Blog de divulgación Cientifica",
    scriptJS: ["/socket.io/socket.io.js", "/javascripts/home.js"],
    session: request.session
  });
}

module.exports = {
  indexHome
};
