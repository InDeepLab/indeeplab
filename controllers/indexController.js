"use strict";

function indexHome(request, response) {
  response.render("index", {
    pageRoutes: ["layout/contenido-blog"],
    title: "InDeepLab | Blog de divulgación Cientifica",
    scriptJS: []
  });
}

module.exports = {
  indexHome
};
