const express = require('express');
const router = express.Router();
const restrict = require('../middlewares/auth.mdw')
const cartController = require('../app/controllers/CartController');

router.get('/add-to-cart/:id', cartController.addToCart);
router.get('/shopping-cart', cartController.shoppingCart);
router.get('/checkout',restrict, cartController.checkout);
router.post('/checkout',restrict, cartController.pay);
router.get('/reduce/:id',restrict, cartController.reduce);
router.get('/addOne/:id',restrict, cartController.addOne);
router.get('/removeAll/:id',restrict, cartController.removeAll);
// router.get('/success', cartController.success);
module.exports = router;
