"use strict";

function contact(request, response) {
  /**
   * Renderizar el template index.html y con el componente
   * de contact.html
   */
  response.render("index", {
    pageRoutes: ["layout/contact"],
    title: "Contacto Luis Miguel Baez | Indeeplab",
    scriptJS: [],
    session: request.session
  });
}

module.exports = {
  contact
};
