const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');
const checkAdmin=require('../middleware/check-admin');


router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.delete("/:userId", checkAuth,checkAdmin, UserController.user_delete);

module.exports = router;
