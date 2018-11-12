var express = require("express");
var router = express.Router();

var matterController = require("../controllers/matterController");

router.get("/create", matterController.createMatter);

router.get("/:nameMatter", matterController.getMatter);

module.exports = router;
