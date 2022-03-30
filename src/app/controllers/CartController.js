const Item = require('../models/Item');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const User = require('../models/User');
const paypal = require('paypal-rest-sdk');
const { mutipleMongooseToObject } = require('../../util/mongoose');
class CartController {
    //[GET] /
    addToCart(req, res, next){
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        
        Item.findById(productId, function(err, product){
            if(err){
                return res.redirect('/');
            }
            cart.add(product,product.id);
            req.session.cart = cart;
            //console.log(req.session.cart);
            res.redirect('/');
        });
    }
    shoppingCart(req, res,next){
        if(!req.session.cart){
            return res.render('carts/shopping-cart',{products:null});
        }
        var cart =new Cart(req.session.cart);
        res.render('carts/shopping-cart',{products:cart.generateArray(),totalPrice:cart.totalPrice});

    }
    checkout(req, res, next){
        if(!req.session.cart){
            return res.redirect('/shopping-cart');
        }
        var errMsg = req.flash('error')[0];
        var cart =new Cart(req.session.cart);
        res.render('carts/checkout', {total:cart.totalPrice,errMsg:errMsg,noError:!errMsg});
    }
    pay(req, res, next){
        if(!req.session.cart){
            return res.redirect('/shopping-cart');
        }
        var cart =new Cart(req.session.cart);
        
        const stripe = require('stripe')('sk_test_51KfIm2L2Q5xKtLuGu1dFCbKbx6JcmrJ1e0g9ejSnFgy74rvd0xYa3MWBnQFWJrWJSawqWnWhBIDdWpevFZt4AmoE00t2Jahs0k');

        stripe.paymentIntents.create({
        amount: cart.totalPrice*100,
        currency: 'usd',
        source: req.body.stripeToken,
        description: 'Example charge'
        },function(err,charge){
            if(err){
                req.flash('error', err.message);
                return res.redirect('back');
            }
            console.log(req.session.authUser);
            var order = new Order({
                user: req.session.authUser,
                cart: cart,
                address:req.body.address,
                name:req.body.name,
                paymentId: charge.id
            });
            order.save(function(err,result) {
                req.flash('success','Successfully bought product');
                req.session.cart= null;
                res.redirect('/');
            });
        });

    }
    // pay(req, res, next){
    //     var cart =new Cart(req.session.cart);
    //     var total = (cart.totalPrice).toString();
    //     var create_payment_json = {
    //         "intent": "sale",
    //         "payer": {
    //             "payment_method": "paypal"
    //         },
    //         "redirect_urls": {
    //             "return_url": "http://localhost:3000/carts/success",
    //             "cancel_url": "http://localhost:3000/carts/cancel"
    //         },
    //         "transactions": [{
    //             "amount": {
    //                 "currency": "USD",
    //                 "total":cart.totalPrice.toString()
    //             },
    //             "description": "This is the payment description."
    //         }]
    //     };        
    //     paypal.payment.create(create_payment_json, function (error, payment) {
    //         if (error) {
    //             throw error;
    //         } else {
    //             // console.log("Create Payment Response");
    //             // console.log(payment);
    //             for(let i=0;i<payment.links.length;i++){
    //                 if(payment.links[i].rel==='approval_url')
    //                 {
    //                     res.redirect(payment.links[i].href);
    //                 }
    //             }
    //         }
    //     });

    // }
    // success(req, res, next){
    //     var cart =new Cart(req.session.cart);
    //     var payerID = req.query.PayerID;
    //     var execute_payment_json = {
    //         "payer_id":payerID,
    //         "transactions": [{
    //             "amount": {
    //                 "currency": "USD",
    //                 "total": cart.totalPrice.toString()
    //             }
    //         }]
    //     };
        
    //     var paymentId = req.query.paymentId;
        
    //     paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    //         if (error) {
    //             console.log(error.response);
    //             throw error;
    //         } else {
    //             res.render('carts/success')
    //         }
    //     });
    // }
    reduce(req, res, next){
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.reduceOne(productId);
        req.session.cart = cart;
        res.redirect('/carts/shopping-cart');
    }
    addOne(req, res, next){
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.addOne(productId);
        req.session.cart = cart;
        res.redirect('/carts/shopping-cart');
    }
    removeAll(req, res, next){
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.removeAll(productId);
        req.session.cart = cart;
        res.redirect('/carts/shopping-cart');
    }
}

module.exports = new CartController();
