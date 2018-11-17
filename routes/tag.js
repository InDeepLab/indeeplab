var express = require("express");
var router = express.Router();

var tagController = require("../controllers/tagController");
var { isAuth } = require("../middlewares/auth");

/**
 * @route: /tag/create
 * @method: GET
 * @description: RENDERIZAR EL FORMULARIO DE REGISTRAR TAG
 */
router.get("/create", isAuth, tagController.createTag);

/**
 * @route: /tag/create
 * @method: POST
 * @description: REGISTRAR EL TAG EN LA BASE DE DATOS
 */
router.post("/create", isAuth, tagController.registerTag);

/**
 * @route: /tag/search
 * @method: GET
 * @description: RENDERIZAR TODOS LOS ARTICULOS DE UN TAG DETERMINADO
 */
router.get("/search", tagController.searchTag);

module.exports = router;
