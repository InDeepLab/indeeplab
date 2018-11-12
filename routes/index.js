var express = require("express");
var router = express.Router();

var indexController = require("../controllers/indexController");

/**
 * @route: /
 * @method: GET
 * @description: RENDERIZA LA PAGINA DE INICIO
 */
router.get("/", indexController.indexHome);

module.exports = router;
