var express = require("express");
var router = express.Router();

var articuloController = require("../controllers/articleController");
var { isAuth } = require("../middlewares/auth");

/**
 * @route: /articulo/nuevo
 * @method: GET
 * @description: FORMULARIO PARA CREAR UN NUEVO ARTICULO
 */
router.get("/nuevo", isAuth, articuloController.crearArticulo);

router.post("/nuevo", isAuth, articuloController.guardarArticulo);

router.get("/", articuloController.article);

router.get("/search", articuloController.search);

router.get("/:id", articuloController.getArticleById);

module.exports = router;
