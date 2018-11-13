var express = require("express");
var router = express.Router();

var authorController = require("../controllers/authorController");

/**
 * @route: /author/login
 * @method: GET
 * @description: RENDERIZAR FORMULARIO DE INICIAR SESION
 */
router.get("/login", authorController.login);

/**
 * @route: /author/login
 * @method: POST
 * @description: VERIFICAR QUE LOS DATOS INGRESADOS SEAN CORRECTOS
 * Y SI ES ASI, CREAR LA SESION
 */
router.post("/login", authorController.verifiedAuthor);

/**
 * @route: /author/signout
 * @method: GET
 * @description: CERRAR SESION
 */
router.get("/signout", authorController.signOut);

module.exports = router;
