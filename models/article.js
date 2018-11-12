"use strict";

const mongoose = require("mongoose");
const Tags = require("./tags");
const Author = require("./author");
const Schema = mongoose.Schema;

const ArticleSchema = Schema({
  title: String,
  author: {
    type: Schema.ObjectId,
    ref: "Author"
  },
  content: String,
  type: String,
  img: String,
  date: {
    type: Date,
    default: new Date()
  },
  tags: [
    {
      type: Schema.ObjectId,
      ref: "Tags"
    }
  ],
  reference: {
    content: String,
    cite: String
  }
});

/**
 * Esta funcion se ejecuta cuando se realizó la eliminación
 * de un articulo, Efecto Cascada
 */
ArticleSchema.pre("remove", function(next) {
  var self = this;
  Tags.update(
    { articles: mongoose.Types.ObjectId(self._id) },
    { $pull: { articles: mongoose.Types.ObjectId(self._id) } },
    { multi: true },
    (err, obj) => {
      if (err) return console.error("Error Remove Tag : ", err);
      //console.log(obj);
      console.log("Remove tag");
    }
  );

  next();
});

module.exports = mongoose.model("Article", ArticleSchema);
