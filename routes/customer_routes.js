const express = require('express');
const router = express.Router();
const { registerCustomer, login, verifyEmail, sendOtp, updateUser } = require('../controllers/customer_controller');

router.post("/register", registerCustomer);
router.post("/sendOtp", sendOtp);
router.post("/login", login);
router.post("/verifyEmail", verifyEmail);
router.post("/updateUser", updateUser);

module.exports = router;