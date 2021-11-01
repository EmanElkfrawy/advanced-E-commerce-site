const express = require("express");

const ProductController = require("../controllers/ProductController");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.post("/",isAuth,isAdmin, ProductController.addPorduct);

router.put("/:productId",isAuth,isAdmin, ProductController.editPorduct);

router.delete("/:productId",isAuth,isAdmin, ProductController.deletePorduct);

router.get("/all",isAuth, ProductController.getallproduct);

router.get("/:productId",isAuth, ProductController.getproduct);

router.get("/related/:productId",isAuth, ProductController.relatedProduct);

router.put("/rate/:productId",isAuth, ProductController.rateProduct);

router.post("",isAuth, ProductController.searchh);

router.post("/f",isAuth, ProductController.filterProduct);

module.exports = router;