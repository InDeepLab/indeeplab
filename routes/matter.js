var express = require("express");
var router = express.Router();

var matterController = require("../controllers/matterController");
var { isAuth } = require("../middlewares/auth");

/**
 * @route: /matter/create
 * @method: GET
 * @description: RENDERIZA EL FORMULARIO QUE PERMITE CREAR UNA MATERIA
 */
router.get("/create", isAuth, matterController.createMatter);

/**
 * @route: /matter/create
 * @method: POST
 * @description: REGISTRA LOS DATOS DE LA MATERIA EN LA VASE DE DATOS
 */
router.post("/create", isAuth, matterController.registerMatter);

/**
 * @route: /matter/search?query=
 * @method: GET
 * @description: HACE UNA CONSULTA DE UNA MATERIA POR EL NOMBRE Y LA RENDERIZA
 */
router.get("/search", matterController.getMatter);

module.exports = router;
