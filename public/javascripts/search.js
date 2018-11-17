$(function() {
  var socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    console.log(socket.connected); // true
  });
  socket.on("searchText", title => {
    if (title === false) {
      if (!title) {
        $("#card-searchText").css({
          display: "none"
        });
        return;
      }
    } else {
      $("#card-searchText").css({
        display: "block"
      });
      $("#searchText").html("Busqueda : " + title.search);
    }
  });

  socket.on("articles", articles => {
    var template = `<div class="card-columns">`,
      html = "",
      url;
    for (var article of articles) {
      url = article.title.slice(0, 46).replace(/ /g, "-");
      url += "-" + article._id;
      template += `
          <a href="/articulo/${url}">
              <div class="card" style="width: 350px;">
                <img class="card-img-top" src="${article.img}">
                <h4>${article.title}</h4>
                <span class="badge align-content-center badge-dark" style="margin-left: 2em;">
                  <span class="icon-newspaper"></span> ${article.type}
                </span>
                <p>${article.content.slice(
                  0,
                  article.content.length > 165 ? 165 : article.content.length
                )}...</p>
                <a href="/articulo/${url}" class="blue-button"><span class="icon-plus"></span> Leer Mas</a>
              </div>
          </a>
        `;
      html += template;
      template = "";
    }
    html += "</div>";
    $("#categories").html(html);
  });
});
