"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Articles = require("./article");

const TagsSchema = Schema({
  name: { type: String, required: true, index: { unique: true } },
  id: String,
  img: String,
  description: String,
  articles: [
    {
      type: Schema.ObjectId,
      ref: "Article"
    }
  ]
});

module.exports = mongoose.model("Tags", TagsSchema);
