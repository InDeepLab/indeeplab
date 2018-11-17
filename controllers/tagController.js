"use strict";

var Matter = require("../models/matter");
var Tag = require("../models/tags");

function createTag(request, response) {
  /**
   * Renderizar el template index.html y con el componente
   * de tags.html
   */
  response.render("index", {
    pageRoutes: ["layout/tags"],
    title: "Crear un nuevo Tag",
    scriptJS: ["/socket.io/socket.io.js", "/javascripts/tag.js"],
    session: request.session
  });

  /**
   * Consulta con todas las materias para mostarla en el formulario
   */
  var queryMatter = {
    $project: {
      description: false,
      __v: false,
      articles: false,
      img: false,
      description: false,
      tags: false
    }
  };

  request.io.on("connection", socket => {
    /**
     * Renderizar las materias en el formulario de registrar tags
     */
    Matter.aggregate([queryMatter], (err, docs) => {
      socket.emit("matters", docs);
    });
  });
}

function registerTag(request, response) {
  /**
   * JSON con los datos del nuevo registro de tag
   */
  var queryTag = {
    name: request.body.name,
    img: request.body.img,
    description: request.body.description
  };
  var newTag = new Tag(queryTag);

  /**
   * Registrar el tag
   */
  newTag.save((err, doc) => {
    if (err) {
      console.error("Error Register Tag : ", err);
      return response.redirect("/tag/create");
    }

    Matter.find({ _id: request.body.matter }, (err, docs) => {
      if (err) {
        console.error("Error Register Tag-Matter : ", err);
        return response.redirect("/tag/create");
      }
      var saveMatter = docs[0];
      saveMatter.tags.push(doc._id);

      var updateMater = new Matter(saveMatter);
      updateMater.save((err, doc) => {
        if (err) {
          console.error("Error Register Tag : ", err);
          return response.redirect("/tag/create");
        }
        console.log("Se actualizo el tag en matter correctamente");
        return response.redirect("/tag/create");
      });
    });
  });
}

function searchTag(request, response) {
  //TODO: RENDERIZAR TODOS LOS ARTICULOS DE UN TAG SELECCIONADO
}

module.exports = {
  createTag,
  registerTag,
  searchTag
};
