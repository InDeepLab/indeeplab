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

/**
 * @route: /articulo/nuevo
 * @method: POST
 * @description: REGISTRAR EL ARTICULO EN LA BASE DE DATOS
 */
router.post("/nuevo", isAuth, articuloController.guardarArticulo);

/**
 * @route: /articulo/search
 * @method: GET
 * @description: CON LOS DATOS QUE EL USUARIO INGRESO EN LA BUSQUEDA
 * OBTENER TODOS LOS ARTICULOS QUE CUMPLAN CON ESOS CRITERIOS
 */
router.get("/search", articuloController.search);

/**
 * @route: /articulo/:id
 * @method: GET
 * @description: RENDERIZAR UN ARTICULO POR EL ID
 */
router.get("/:id", articuloController.getArticleById);

module.exports = router;
