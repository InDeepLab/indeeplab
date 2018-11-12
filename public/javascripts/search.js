$(function() {
  var socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    console.log(socket.connected); // true
  });
  socket.on("searchText", title => {
    console.log(title);
    $("#searchText").html("Busqueda : " + title.search);
  });

  socket.on("articles", articles => {
    var template,
      html = "";
    for (var article of articles) {
      template = `
          <div class="card-columns">
          <a href="#">
              <div class="card">
                <img src="${article.img}">
                <h4>${article.title}</h4>
                <span class="badge align-content-center badge-dark" style="margin-left: 2em;">
                  <span class="icon-newspaper"></span> ${article.type}
                </span>
                <p>${article.content.slice(
                  0,
                  article.content.length > 165 ? 165 : article.content.length
                )}...</p>
                <a href="#" class="blue-button"><span class="icon-plus"></span> Leer Mas</a>
              </div>
          </a>

        </div>
        `;
      html += template;
    }
    $("#categories").html(html);
  });
});
