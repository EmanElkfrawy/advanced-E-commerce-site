const express = require("express");

const router = express.Router();

const userController = require("../controllers/userControllers");
const isAuth = require("../middleware/isAuth");

router.post('/signup', userController.signUp);

router.put('/verify', userController.verifyMail);

router.get('/login', userController.logIn);

router.get('/:userId', isAuth, userController.viewProfile);


module.exports = router;
