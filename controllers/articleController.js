"use strict";

var Article = require("../models/article");
var Tags = require("../models/tags");
var Author = require("../models/author");
const mongoose = require("mongoose");

//GET /articulo/nuevo
function crearArticulo(request, response) {
  var queryAuthor = [
    {
      $match: {
        _id: mongoose.Types.ObjectId(request.session.author._id)
      }
    },
    {
      $project: {
        password: false,
        articles: false
      }
    }
  ];
  var queryTags = {
    $project: {
      __v: false,
      articles: false
    }
  };

  request.io.on("connection", socket => {
    Author.aggregate(queryAuthor, (err, author) => {
      socket.emit("author", author);
    });
    Tags.aggregate([queryTags], (err, tags) => {
      socket.emit("tags", tags);
    });
  });

  response.render("index", {
    pageRoutes: ["layout/crear-articulo"],
    title: "Crear un Nuevo Articulo",
    scriptJS: [],
    session: request.session
  });
}

/*
body
{ 
  title: 'Title',
  author: '5be25b36bc0e152984260b3f',
  img: 'lsadald',
  tipo: 'Articulo',
  content: 'daskdskada',
  states: [ 'Machine Learning', 'Deep Learning', 'Data Mining' ],
  referenceCite: 'lfdasfaf,lasfokadsfk',
  authorCite: 'kldskfla' 
}
*/
//POST /articulo/nuevo
function guardarArticulo(request, response) {
  var body = request.body;
  var data = {
    title: body.title,
    author: mongoose.Types.ObjectId(body.author),
    content: body.content,
    type: body.tipo,
    img: body.img
  };

  if (body.referenceCite && body.authorCite) {
    data.reference = {
      content: body.referenceCite,
      cite: `<footer class='blockquote-footer'>por <span class='con-user-tie'/span><cite title='Source Title'>
      ${body.authorCite}</cite></footer>`
    };
  }

  var name = "";
  if (body.states instanceof Array) {
    for (var i = 0; i < body.states.length; i++) {
      name +=
        i != body.states.length - 1 ? body.states[i] + "|" : body.states[i];
    }
  } else {
    name = body.states;
  }

  var re = new RegExp(name, "g");
  var query = Tags.find({ name: re });

  query
    .then(function(doc) {
      let tags = [];
      if (body.states instanceof Array) {
        for (var xx of doc) {
          tags.push(new Tags(xx));
        }
      } else {
        tags.push(new Tags(doc[0]));
      }

      data.tags = tags;

      let article = new Article(data);

      article.save((err, obj) => {
        if (err) {
          response.status(500).send({
            message: "Error al guardar en la base de datos"
          });
        }
        console.log("El articulo se registro Correctamente!!! ", obj);

        for (var tag of tags) {
          tag.articles.push(mongoose.Types.ObjectId(obj._id));
          tag.save(err => {
            if (err) return handleError(err);
            console.log("Tags Updates");
          });
        }
      });
      response.redirect("/articulo/nuevo");
    })
    .catch(err => {
      response.redirect("/articulo/nuevo");
    });
}

function render(request, response) {
  response.render("article", {
    title: "Articulo",
    article: article,
    scriptJS: [],
    session: request.session
  });
}

//GET: /articulo
function article(request, response) {
  render(request, response);
  let idCollections = "5be8b9bc983d620be0f28348";

  request.io.on("connection", socket => {
    var query = [
      {
        $addFields: {
          tags: {
            $ifNull: ["$tags", []]
          }
        }
      },
      {
        $match: {
          //Conditions
          _id: mongoose.Types.ObjectId(idCollections)
        }
      },
      {
        $lookup: {
          //Join Tags
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags"
        }
      },
      {
        $lookup: {
          //Join Author
          from: "authors",
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      },
      {
        $project: {
          //SELECT: Proyectar columnas
          "tags.id": false,
          "tags._id": false,
          "tags.__v": false,
          "author.articles": false
        }
      }
    ];

    Article.aggregate(query).exec((err, articles) => {
      if (err) {
        return console.error("Error findById(): ", err);
      }
      socket.emit("article", {
        title: articles[0].title,
        author: articles[0].author[0],
        date: articles[0].date,
        content: request.md.render(articles[0].content),
        tags: articles[0].tags,
        reference: {
          content: articles[0].reference
            ? request.md.render(articles[0].reference.content)
            : undefined,
          cite: articles[0].reference ? articles[0].reference.cite : undefined
        }
      });
    });
  });
}

function search(request, response) {
  var regExp = new RegExp(request.query.search, "g");
  console.log(regExp);

  request.io.on("connection", socket => {
    Article.find({ content: regExp }, (err, articles) => {
      socket.emit("searchText", request.query);
      socket.emit("articles", articles);
      console.log(articles.length);
    });
  });

  response.render("index", {
    title: "Articulo",
    scriptJS: ["/javascripts/search.js", "/socket.io/socket.io.js"],
    pageRoutes: ["layout/search"],
    session: request.session
  });
}

function getArticleById(request, response) {
  var id = request.params.id;
  var objId = id.split("-").pop();

  render(request, response);

  request.io.on("connection", socket => {
    var query = [
      {
        $addFields: {
          tags: {
            $ifNull: ["$tags", []]
          }
        }
      },
      {
        $match: {
          _id: mongoose.Types.ObjectId(objId)
        }
      },
      {
        $lookup: {
          //Join Tags
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags"
        }
      },
      {
        $lookup: {
          //Join Author
          from: "authors",
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      },
      {
        $project: {
          //SELECT: Proyectar columnas
          "tags.id": false,
          "tags._id": false,
          "tags.__v": false,
          "author.articles": false
        }
      }
    ];

    Article.aggregate(query).exec((err, articles) => {
      if (err) {
        return console.error("Error findById(): ", err);
      }
      socket.emit("article", {
        title: articles[0].title,
        author: articles[0].author[0],
        date: articles[0].date,
        content: request.md.render(articles[0].content),
        tags: articles[0].tags,
        reference: {
          content: articles[0].reference
            ? request.md.render(articles[0].reference.content)
            : undefined,
          cite: articles[0].reference ? articles[0].reference.cite : undefined
        }
      });
    });
  });
}

module.exports = {
  crearArticulo,
  guardarArticulo,
  article,
  search,
  getArticleById
};
