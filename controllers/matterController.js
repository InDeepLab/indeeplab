"use strict";

const mongoose = require("mongoose");
var Matters = require("../models/matter");

function getMatter(request, response) {
  /**
   * Renderizar el template index.html y con el componente
   * de matter.html
   */
  response.render("index", {
    pageRoutes: ["layout/matter"],
    title: "Matters",
    scriptJS: ["/javascripts/matter.js", "/socket.io/socket.io.js"],
    session: request.session
  });

  /**
   * Consulta que trae el registro de una materia filtrada por el nombre
   * que fué ingresado por el usuario
   */
  var query = [
    {
      $match: {
        name: request.query.search
      }
    },
    {
      $project: {
        "tags._id": false,
        "tags.id": false,
        "tags.__v": false,
        __v: false,
        img: false
      }
    },
    {
      $limit: 1
    }
  ];

  request.io.once("connection", socket => {
    /**
     * Ejecuta la consulta que trae la materia y envia los datos mediante
     * socket.io para posteriormente renderizarlo
     */
    Matters.aggregate(query, (err, result) => {
      if (err) return console.error("Error Matters query");
      if (result.length > 0) {
        console.log(result[0].tags.length);
        if (result[0].tags.length == 0) {
          socket.emit("matter", result[0], true);
        } else {
          var queryMatters = [
            {
              $match: {
                name: request.query.search
              }
            },
            {
              $lookup: {
                from: "tags",
                localField: "tags",
                foreignField: "_id",
                as: "tags"
              }
            },
            {
              $unwind: "$tags"
            },
            {
              $lookup: {
                from: "articles",
                localField: "tags.articles",
                foreignField: "_id",
                as: "tags.articles"
              }
            }
          ];
          Matters.aggregate(queryMatters, (err, result) => {
            if (err) return console.error("Error Matters query");
            socket.emit("matter", result, false);
          });
        }
      }
    });
  });
}

function createMatter(request, response) {
  /**
   * Renderizar el template index.html y con el componente
   * de createMatters.html
   */
  response.render("index", {
    pageRoutes: ["layout/createMatters"],
    title: "Crear Materias",
    scriptJS: [],
    session: request.session
  });
}

function registerMatter(request, response) {
  /**
   * JSON con los datos para registrar una nueva materia
   */
  var data = {
    name: request.body.name,
    img: request.body.img,
    description: request.body.description,
    tags: []
  };

  var matter = new Matters(data);

  /**
   * Registrar la materia en la base de datos
   */
  matter.save((err, obj) => {
    if (err) {
      response.redirect("/matter/create");
      return console.error("Error: register matter : ", err);
    }
    console.log("La materia se registro CORRECTAMENTE");
    response.redirect("/matter/create");
  });
}

module.exports = {
  getMatter,
  createMatter,
  registerMatter
};
