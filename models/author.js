"use strict";

const mongoose = require("mongoose");
const { hashMd5 } = require("../lib/hash");
const Schema = mongoose.Schema;

const AuthorSchema = Schema({
  name: String,
  description: String,
  img: String,
  twitter: String,
  facebook: String,
  github: String,
  instagram: String,
  articles: [
    {
      type: Schema.ObjectId,
      ref: "Article"
    }
  ],
  user: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

AuthorSchema.pre("save", function(next) {
  var author = this;
  author.password = hashMd5(author.password);
  next();
});

/**
 *
 * @param {Password to compare} candidatePassword
 * @param {callback with return} callback
 * 
 * author.comparePassword("Password123", (err, isMatch) {
 *  if (err) throw err;
    console.log('Password123:', isMatch);
 * })
 */
AuthorSchema.methods.comparePassword = function(candidatePassword, callback) {
  if (candidatePassword === undefined) {
    callback(new Error("Password can´t are undefined"));
  }
  callback(null, hashMd5(candidatePassword) === this.password);
};

//https://stackoverflow.com/questions/14588032/mongoose-password-hashing

module.exports = mongoose.model("Author", AuthorSchema);
