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

  request.io.once("connection", socket => {
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

  /**
   * Renderizar el template index.html y con el componente
   * de search.html
   */
  response.render("index", {
    title: "Articulo",
    scriptJS: ["/javascripts/search.js", "/socket.io/socket.io.js"],
    pageRoutes: ["layout/search"],
    session: request.session
  });

  var name = request.query.name;
  console.log(name);
  var queryArticles = [
    {
      $match: {
        name: name
      }
    },
    {
      $lookup: {
        from: "articles",
        localField: "articles",
        foreignField: "_id",
        as: "articles"
      }
    }
  ];

  request.io.once("connection", socket => {
    Tag.aggregate(queryArticles, (err, docs) => {
      if (err) return console.error("Error searchTag() : ", err);
      console.log(docs.length > 0);
      if (docs.length > 0) {
        socket.emit("searchText", false);
        socket.emit("articles", docs[0].articles);
      } else {
        socket.emit("searchText", {
          search: "Not Found"
        });
      }
    });
  });
}

module.exports = {
  createTag,
  registerTag,
  searchTag
};
