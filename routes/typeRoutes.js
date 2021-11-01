const express = require("express");

const peopletype = require("../controllers/peopleTypeController");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.post("/",isAuth,isAdmin, peopletype.addType);

router.put("/:typeId", isAuth, isAdmin, peopletype.editType);

router.delete("/:typeId",isAuth, isAdmin, peopletype.deleteType);

module.exports = router;