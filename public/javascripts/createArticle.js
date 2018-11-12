"use strict";

$(function() {
  var socket = io.connect("http://localhost:3000");

  //RENDER SIMPLE MDE
  var simplemde = new SimpleMDE();
  simplemde.render();

  socket.on("connect", () => {
    console.log(socket.connected); // true
  });

  socket.on("authors", author => {
    var html = "";
    for (var x of author) {
      html += `<option value="${x._id}">${x.name}</option>`;
    }
    $("#authorData").html(html);
  });

  socket.on("tags", tags => {
    var html = "";
    for (var tag of tags) {
      var template = `
      <option value="${tag._id}">${tag.name}</option>
      `;
      html += template;
    }
    $("#tags").html(html);

    $(function() {
      $("select#tags").bsMultiSelect();
    });
  });
});
