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

  socket.on("matter", (result, flag) => {
    var elementTag = $("#tags");
    var elementMatter = $("#matter");
    var elementDescription = $("#matter-description");
    var html = "";

    var i = 1;
    if (flag) {
      elementMatter.html(result.name);
      elementDescription.html(result.description);
    } else {
      for (var tag of result) {
        var label = i % 2 == 0 ? "text-primary" : "text-success";
        var description = tag.tags.description;
        console.log(tag);
        description =
          description.length > 45 ? description.slice(0, 45) : description;

        var template = `
        <div class="col-md-6">
              <div class="card flex-md-row mb-4 box-shadow h-md-250">
                <div class="card-body d-flex flex-column align-items-start">
                  <strong class="d-inline-block mb-2 ${label}"
                    >${tag.name}</strong
                  >
                  <h3 class="mb-0">
                    <a class="text-dark" href="#" style="font-size: 1.3rem;"
                      >${tag.tags.name}</a
                    >
                  </h3>
                  <div class="mb-1 text-muted">${
                    tag.tags.articles.length
                  } Articles</div>
                  <p class="card-text mb-auto">
                    ${description}...
                  </p>
                  <a href="/tag/search/?name=${tag.tags.name}">Ir a</a>
                </div>
                <img
                  class="card-img-right flex-auto d-none d-md-block"
                  alt="${tag.tags.name}"
                  style="width: 130px; height: 130px;"
                  src="${tag.tags.img}"
                />
              </div>
            </div>
        `;
        i++;
        html += template + "\n";
      }
      elementTag.html(html);
      elementMatter.html(result[0].name);
      elementDescription.html(result[0].description);
    }
  });
});
