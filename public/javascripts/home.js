"use strict";

$(function() {
  var socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    console.log(socket.connected); // true
    if (!window.location.hash) {
      window.location.href = window.location.href + "#loaded";
      window.location.reload();
    } else {
      window.location.hash = "";
    }
  });

  socket.once("articles", docs => {
    console.log(docs);
    var template,
      html = "",
      content,
      url;
    var cardArticles = $("#cardArticles");
    for (var doc of docs) {
      content =
        doc.content.length > 300
          ? (content = doc.content.slice(0, 300))
          : (content = doc.content);

      url = doc.title.slice(0, 46).replace(/ /g, "-");
      url += "-" + doc._id;

      template = `
      <div class="card mb-4">
        <img
          class="card-img-top"
          src="${doc.img}"
          alt="${doc.title}"
          width="700"
          height="300"
        />
        <div class="card-body">
          <h2 class="card-title">${doc.title}</h2>
          <p class="card-text">
            ${content}...
          </p>
          <a href="/articulo/${url}" class="btn btn-primary">Leer Mas →</a>
        </div>
        <div class="card-footer text-muted">
          Publicado el ${formatDate(new Date(doc.date))} por
          <a href="#">${doc.author[0].name}</a>
          <span
            class="badge align-content-center badge-dark"
            style="margin-left: 2em;"
          >
            <span class="icon-newspaper"></span> Articulo
          </span>
        </div>
      </div>
        `;
      html += template;
    }
    cardArticles.html(html);
  });

  socket.on("pagination", page => {
    console.log(page);
    var previous = $("#previous");
    var liPrevious = $("#li-previous");
    var next = $("#next");
    var liNext = $("#li-next");

    if (page.currentPage == page.pageCount) {
      liNext.addClass("disabled");
      liPrevious.removeClass("disabled");
      previous.attr("href", "/articulo/page/?page=" + (page.currentPage - 1));
      next.attr("href", "/articulo/page/?page=" + page.currentPage);
    } else if (page.currentPage === 1) {
      liPrevious.addClass("disabled");
      liNext.removeClass("disabled");
      previous.attr("href", "/articulo/page/?page=" + page.currentPage);
      next.attr("href", "/articulo/page/?page=" + (page.currentPage + 1));
    } else {
      liPrevious.removeClass("disabled");
      liNext.removeClass("disabled");
      previous.attr("href", "/articulo/page/?page=" + (page.currentPage - 1));
      next.attr("href", "/articulo/page/?page=" + (page.currentPage + 1));
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
