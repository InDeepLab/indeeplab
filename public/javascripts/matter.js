"use strict";

$(function() {
  var socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    console.log(socket.connected); // true
  });

  socket.on("matters", result => {
    console.log(result);

    var elementTag = $("#tags");
    var elementMatter = $("#matter");
    var elementDescription = $("#matter-description");
    var html = "";
    var i = 1;
    for (var tag of result.tags) {
      var label = i % 2 == 0 ? "text-primary" : "text-success";
      var template = `
        <div class="col-md-6">
              <div class="card flex-md-row mb-4 box-shadow h-md-250">
                <div class="card-body d-flex flex-column align-items-start">
                  <strong class="d-inline-block mb-2 ${label}"
                    >${result.name}</strong
                  >
                  <h3 class="mb-0">
                    <a class="text-dark" href="#" style="font-size: 1.3rem;"
                      >${tag.name}</a
                    >
                  </h3>
                  <div class="mb-1 text-muted">12 Articles</div>
                  <p class="card-text mb-auto">
                    ${tag.description}
                  </p>
                  <a href="#">Ir a</a>
                </div>
                <img
                  class="card-img-right flex-auto d-none d-md-block"
                  alt="${tag.name}"
                  style="width: 130px; height: 130px;"
                  src="${tag.img}"
                />
              </div>
            </div>
        `;
      i++;
      html += template + "\n";
    }
    elementTag.html(html);
    elementMatter.html(result.name);
    elementDescription.html(result.description);
  });
});
