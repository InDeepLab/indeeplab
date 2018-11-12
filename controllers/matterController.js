"use strict";

const mongoose = require("mongoose");
var Matters = require("../models/matter");

function getMatter(request, response) {
  var name = request.params;

  response.render("index", {
    pageRoutes: ["layout/matter"],
    title: "Matters",
    scriptJS: ["/javascripts/matter.js", "/socket.io/socket.io.js"]
  });

  var query = [
    {
      $match: {
        name: name.nameMatter
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
      $project: {
        "tags._id": false,
        "tags.id": false,
        "tags.__v": false,
        __v: false
      }
    },
    {
      $limit: 1
    }
  ];

  request.io.on("connection", socket => {
    Matters.aggregate(query, (err, result) => {
      socket.emit("matters", result[0]);
    });
  });
}

function createMatter(request, response) {
  response.render("index", {
    pageRoutes: ["layout/createMatters"],
    title: "Crear Materias",
    scriptJS: []
  });
}

module.exports = {
  getMatter,
  createMatter
};
