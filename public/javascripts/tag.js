"use strict";

$(function() {
  var socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    console.log(socket.connected); // true
  });

  socket.on("matters", docs => {
    console.log(docs);
    var template = "";

    for (var doc of docs) {
      template += `<option value="${doc._id}">${doc.name}</option>\n`;
    }
    $("#listMatter").html(template);
  });
});
