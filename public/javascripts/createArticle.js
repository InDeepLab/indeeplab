"use strict";

$(function() {
  var socket = io.connect("http://localhost:3000");

  //RENDER SIMPLE MDE
  var simplemde = new SimpleMDE();
  simplemde.render();

  socket.on("connect", () => {
    console.log(socket.connected); // true
  });

  socket.once("author", author => {
    $("#author").val(author[0]._id);
    $("#author").prop("disabled", true);
    console.log(author);
  });

  $("#newArticle").mouseenter(() => {
    $("#author").prop("disabled", false);
  });

  $("#newArticle").mouseleave(() => {
    $("#author").prop("disabled", true);
  });

  socket.once("tags", tags => {
    var html = "";
    for (var tag of tags) {
      var template = `
      <option value="${tag.name}">${tag.name}</option>
      `;
      html += template;
    }
    $("#tags").html(html);

    $(function() {
      $("select#tags").bsMultiSelect();
    });
  });
});
