const express = require("express");

const peopletype = require("../controllers/Category");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.post("/",isAuth, isAdmin, peopletype.addCategory);

router.put("/:categoryId",isAuth, isAdmin, peopletype.editCategory);

router.delete("/:categoryId",isAuth, isAdmin, peopletype.deleteCategory);

module.exports = router;
