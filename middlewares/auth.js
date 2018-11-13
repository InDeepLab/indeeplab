"use strict";

/**
 * [isAuth: Este Middleware me permite bloquear rutas si no se ha iniciado session]
 */
function isAuth(request, response, next) {
  if (request.session.author) {
    return next();
  }
  response.redirect("/author/login");
}

module.exports.isAuth = isAuth;
