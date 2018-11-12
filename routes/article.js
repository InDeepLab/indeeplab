var express = require("express");
var router = express.Router();

var articuloController = require("../controllers/articleController");

/**
 * @route: /articulo/nuevo
 * @method: GET
 * @description: FORMULARIO PARA CREAR UN NUEVO ARTICULO
 */
router.get("/nuevo", articuloController.crearArticulo);

router.post("/nuevo", articuloController.guardarArticulo);

router.get("/", articuloController.article);

router.get("/search", articuloController.search);

module.exports = router;
