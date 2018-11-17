"use strict";

$(function() {
  var socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    console.log(socket.connected); // true
  });

  var converter = new showdown.Converter();

  socket.on("article", article => {
    console.log(article.reference);
    var html = article.content; //converter.makeHtml(article.content);

    $("#content").html(html);

    $("#title").html(article.title);
    $("#name-article-cite").html(article.title);

    $("#author").html(article.author.name);

    $("#date").html(formatDate(new Date(article.date)));

    //COLOREAR CODE
    var codehtml = $("code");
    var pre = $("pre");
    pre.attr("class", "prettyprint");
    PR.prettyPrint();

    console.log(article.tags);
    var tags = article.tags;

    var _tag = $("#tags-name");

    _tag.html(`<span class="icon-price-tag"></span> Tags:`);

    for (var i = 0; i < tags.length; i++) {
      if (!(i == tags.length - 1)) {
        _tag.append(`<a href="#" class="text-muted">${tags[i].name}</a>, `);
      } else {
        _tag.append(`<a href="#" class="text-muted">${tags[i].name}</a>`);
      }
    }

    if (article.reference.content && article.reference.cite) {
      $("#text-reference").html(
        article.reference.content + " " + article.reference.cite
      );
      $("#card-reference").css({
        display: "block"
      });
      $("#card-body").css({
        display: "block"
      });
    }
  });

  function formatDate(date) {
    var monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
  }
});
