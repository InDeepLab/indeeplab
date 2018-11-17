"use strict";

var Article = require("../models/article");
var Tags = require("../models/tags");
var Author = require("../models/author");
var Articles = require("../models/article");
const mongoose = require("mongoose");

//GET /articulo/nuevo
function crearArticulo(request, response) {
  /**
   * Query para traer el author que inicio seccion
   */
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
  /**
   * Query que trae todos los tags de la DB
   */
  var queryTags = {
    $project: {
      __v: false,
      articles: false
    }
  };

  request.io.on("connection", socket => {
    /**
     * Hacer consulta para traer el author que inicio session
     * y enviar los datos al cliente por medio de socket.io
     * para poder renderizarlos
     */
    Author.aggregate(queryAuthor, (err, author) => {
      socket.emit("author", author);
    });

    /**
     * Hacer consulta para traer todos los tags registrados en la DB
     * y enviar los datos al cliente por medio de socket.io
     * para poder renderizarlos
     */
    Tags.aggregate([queryTags], (err, tags) => {
      socket.emit("tags", tags);
    });
  });

  /**
   * Renderizar el template index.html y con el componente
   * de crear-articulo.html
   */
  response.render("index", {
    pageRoutes: ["layout/crear-articulo"],
    title: "Crear un Nuevo Articulo",
    scriptJS: [],
    session: request.session
  });
}

//POST /articulo/nuevo
function guardarArticulo(request, response) {
  var body = request.body;
  /**
   * Datos del registro del nuevo articulo
   */
  var data = {
    title: body.title,
    author: mongoose.Types.ObjectId(body.author),
    content: body.content,
    type: body.tipo,
    img: body.img
  };

  /**
   * En caso de que el author hubierá referenciado se ejecuta este bloque
   * de codigo, que lo que hace es agregar la referencia la json data que
   * contiene el registro del nuevo articulo
   */
  if (body.referenceCite && body.authorCite) {
    data.reference = {
      content: body.referenceCite,
      cite: `<footer class='blockquote-footer'>por <span class='con-user-tie'/span><cite title='Source Title'>
      ${body.authorCite}</cite></footer>`
    };
  }

  /**
   * Crear el string de la consulta para traer el _id de cada uno de los tags
   * que se seleccionaron para posteriormente enlazarlos con el articulo
   */
  var name = "";
  if (body.states instanceof Array) {
    for (var i = 0; i < body.states.length; i++) {
      name +=
        i != body.states.length - 1 ? body.states[i] + "|" : body.states[i];
    }
  } else {
    name = body.states;
  }
  console.log("name : " + name);
  /**
   * Expresion regular de la consulta que permite traer el _id de los tags
   */
  var re = new RegExp(name, "g");
  var query = Tags.find({ name: re });

  /**
   * Consulta que trae el _id de los tags
   */
  query
    .then(function(doc) {
      var tags = [];
      console.log("Docs : ", doc);
      //Crear un Array con los modelos (Tags)
      if (body.states instanceof Array) {
        for (var xx of doc) {
          tags.push(new Tags(xx));
        }
      } else {
        tags.push(new Tags(doc[0]));
      }

      data.tags = tags;
      console.log("Tags : ", tags);
      /**
       * Se creó el documento donde se enlazan el articulos con los Tags
       */
      let article = new Article(data);

      /**
       * Consulta que permite registrar en la base de datos
       * el articulo nuevo
       */
      article.save((err, obj) => {
        if (err) {
          response.status(500).send({
            message: "Error al guardar en la base de datos"
          });
        }
        console.log("El articulo se registro Correctamente!!! ", obj);

        /**
         * Consulta que permite actualizar el _id de los articulos
         * en la colección de Tags
         */
        for (var tag of tags) {
          tag.articles.push(mongoose.Types.ObjectId(obj._id));
          console.log("tags : ", tag);
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

//GET: /articulo/search
function search(request, response) {
  /**
   * Expresion regular con la busqueda realizada por el cliente
   */
  var regExp = new RegExp(request.query.search, "g");

  /**
   * Consulta que busca todos los articulos que contengas palabras
   * previamente ingresada por el cliente
   */
  var query = [
    {
      $match: {
        $or: [{ content: regExp }, { title: regExp }]
      }
    },
    {
      $limit: 20
    }
  ];

  /**
   * Los resultados de la consultas se envian al client
   * mediante socket.io para posteriormente ser renderizadas
   */
  request.io.on("connection", socket => {
    Article.aggregate(query, (err, articles) => {
      socket.emit("searchText", request.query);
      socket.emit("articles", articles);
    });
  });

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
}

//GET: /articulo/:id
function getArticleById(request, response) {
  /**
   * request.params trae los parametros que se ingresaron en la peticion GET
   * /articulo/:id y ahí podemos obtener el _id para poder hacer la consulta
   */
  var id = request.params.id;
  var objId = id.split("-").pop();

  if (objId.length != 24) {
    return response.redirect("/");
  }

  render(request, response);

  /**
   * En esta query traemos el articulo cuyo _id se ingreso en la URL
   */
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

  request.io.once("connection", socket => {
    Article.aggregate(query).exec((err, articles) => {
      if (err) {
        return console.error("Error findById(): ", err);
      }

      /**
       * Se envian los resultados mediante socket.io para posteriormente
       * renderizarlos en el lado del cliente
       */
      if (articles.length > 0) {
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
      }
    });
  });
}

/**
 * Función que permite renderizar un articulo
 */
function render(request, response) {
  response.render("article", {
    title: "Articulo",
    scriptJS: [],
    session: request.session
  });
}

var totalArticles, //Numero de Articulos
  pageSize, //Longitud de cada pagina
  pageCount, //TotalArticles / pageSize + 1;
  currentPage, //Pagina Actual
  articles = undefined, //Articulos a renderizar
  result, //Articulos a renderizar
  articlesArrays = [], //Articulos divididos en paginas
  articlesList = []; //Articulos arenderizar

function getAllArticles(request, response) {
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
    }
  ];
  request.io.once("connection", socket => {
    if (articles === undefined) {
      /**
       * Hacer una consulta de los ultimos 20 registros de articulos
       * y enviarlos mediante socket.io para posteriormente renderizarlos
       */
      Articles.aggregate(queryArticle, (err, docs) => {
        if (err) return console.error("Error: ", err);
        articles = docs;
        result = docs;
        totalArticles = docs.length;
        pageSize = 2;
        pageCount = parseInt(totalArticles / pageSize + 1);
        currentPage = parseInt(request.query.page);
        var tmp = undefined;
        while (articles.length > 0) {
          tmp = articles.splice(0, pageSize);
          articlesArrays.push(tmp);
        }
        articlesList = articlesArrays[currentPage - 1];
        socket.emit("articles", articlesArrays[currentPage - 1]);
        socket.emit("pagination", {
          pageCount: pageCount,
          currentPage: currentPage
        });
      });
    } else {
      pageSize = 2;
      pageCount = parseInt(totalArticles / pageSize + 1);
      currentPage = parseInt(request.query.page);
      articlesList = articlesArrays[currentPage - 1];
      socket.emit("articles", articlesArrays[currentPage - 1]);
      socket.emit("pagination", {
        pageCount: pageCount,
        currentPage: currentPage
      });
    }
  });
}

module.exports = {
  crearArticulo,
  guardarArticulo,
  search,
  getArticleById,
  getAllArticles
};
