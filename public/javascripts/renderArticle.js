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

    for (var tag of tags) {
      _tag.append(`<a href="#" class="text-muted">${tag.name}</a>,`);
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

  /*var katex_element = $(".katex");
            console.log(katex_element)
            var title = katex_element[0].title;
            title = String(title)

            for (var i = 0; i < katex_element.length; i++) {
                var title = katex_element[i].title;
                console.log(title)
                katex.render(title, katex_element[i]);
            }*/

  //katex.render(title, katex_element[0]);

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
