const express = require("express");

const commentController = require("../controllers/commentController");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.post("/", isAuth, commentController.createComment);

router.put("/:commentId", isAuth, commentController.updateComment);

router.get("/", isAuth, commentController.getAllComments);

router.delete("/:commentId", isAuth, commentController.deleteComment);

module.exports = router;
