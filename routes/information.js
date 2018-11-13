var express = require("express");
var router = express.Router();

var infoController = require("../controllers/infoController");

/**
 * @route: /info/contact
 * @method: GET
 * @description: Renderizar contacto
 */
router.get("/contact", infoController.contact);

module.exports = router;
