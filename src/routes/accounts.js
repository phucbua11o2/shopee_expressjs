const express = require('express');
const router = express.Router();
const restrict= require('../middlewares/auth.mdw')
const accountController = require('../app/controllers/AccountController');

router.post('/buyer', accountController.buyer);
router.get('/register', accountController.register);
router.get('/login', accountController.login);
router.post('/logout', restrict,accountController.logout);
router.post('/exploit', accountController.exploit);

module.exports = router;
