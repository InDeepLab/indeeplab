"use strict";

$(function() {
  var socket = io.connect("http://localhost:3000");
  var url;

  socket.on("connect", () => {
    console.log(socket.connected); // true

    if (!window.location.hash) {
      window.location.href = window.location.href + "#loaded";
      window.location.reload();
    } else {
      window.location.hash = "";
    }
  });

  var converter = new showdown.Converter();

  socket.on("article", article => {
    console.log(article);
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
        _tag.append(
          `<a href="/tag/search/?name=${tags[i].name}" class="text-muted">${
            tags[i].name
          }</a>, `
        );
      } else {
        _tag.append(
          `<a href="/tag/search/?name=${tags[i].name}" class="text-muted">${
            tags[i].name
          }</a>`
        );
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

    var profileAuthor = $("#profile-author");
    var template = `
          <div class="row justify-content-center">
            <div class="col-md-4">
              <img class="rounded-circle" src="/images/author.JPG"  style="width: 200px; height: 200px;" alt="Image">
            </div>
            <div class="col-md-8">
              <blockquote class="blockquote" style="border-left: 5px solid #eee;padding: 10px 20px;">
                <h5>${article.author.name}</h5>
                <p><em><small>${article.author.description}</small></em></p>
              
              <p >
                <span class="icon-twitter"></span><a href="https://twitter.com/LuisMBaezCo" target="_blank"> @LuisMBaezCo</a> <br>
                <span class="icon-facebook2"><a href="https://www.facebook.com/LuisMBaezCo" target="_blank"></span> /LuisMBaezCo</a> <br>
                
              </p>
              </blockquote>
            </div>
          </div>
    `;
    profileAuthor.html(template);

    /*setTimeout(function() {
      window.location.href = window.location.href.substr(
        0,
        window.location.href.indexOf("#")
      );
    }, 2000);*/
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
