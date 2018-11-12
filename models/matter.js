"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatterSchema = Schema({
  name: { type: String, required: true, index: { unique: true } },
  description: String,
  img: String,
  tags: [
    {
      type: Schema.ObjectId,
      ref: "Tags"
    }
  ]
});

module.exports = mongoose.model("Matter", MatterSchema);
