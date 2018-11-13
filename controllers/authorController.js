"use strict";

var Author = require("../models/author");
var { hashMd5 } = require("../lib/hash");

//GET: /author/login
function login(request, response) {
  /**
   * Renderizar el formulario de Iniciar Session
   */
  response.render("index", {
    pageRoutes: ["layout/login"],
    title: "Log In | Indeeplab",
    scriptJS: [],
    session: request.session
  });
}

//POST: /author/login
function verifiedAuthor(request, response) {
  /**
   * Verificar si el usuario y contraseña del usuario que inicio session
   * son validos y si son validos registrar la session
   */
  Author.find({ user: request.body.user }, (err, docs) => {
    var author = docs[0];

    if (hashMd5(request.body.password) === author.password) {
      var data = {
        name: author.name,
        user: author.user,
        _id: author._id
      };

      request.session.author = {};
      request.session.author = data;
      response.redirect("/");
    } else {
      response.redirect("/author/login");
    }
  });
}

/**
 * Cerrar la session
 */
function signOut(request, response) {
  request.session.destroy();
  response.redirect("/");
}

module.exports = {
  login,
  verifiedAuthor,
  signOut
};
