const express = require("express");

const orderController = require("../controllers/orderController");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.post("/buy", isAuth, orderController.sendadminorders);
router.delete("/:productId", isAuth, orderController.removedFromOrder);

router.post("/:productId", isAuth, orderController.addToOrder);

router.put("/:productId", isAuth, orderController.selectQuantity);

router.get("/", isAuth, orderController.getallproductsOrder);

router.get("/code", isAuth, orderController.productbycode);


module.exports = router;
