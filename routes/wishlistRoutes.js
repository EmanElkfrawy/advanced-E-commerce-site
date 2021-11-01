const express = require("express");

const whishListController = require("../controllers/whishListController");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.delete("/clearall/", isAuth, whishListController.clearCart);

router.post("/:productId/", isAuth, whishListController.addtoCart);

router.delete("/:productId/", isAuth, whishListController.deleteFromCart);

router.get("/all", isAuth, whishListController.viewCartWithAllProduct);


module.exports = router;
