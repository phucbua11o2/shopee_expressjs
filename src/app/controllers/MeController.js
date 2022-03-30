const Item = require('../models/Item');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
class MeController {
    //[GET] /me/stored/items
    storedItems(req, res, next) {
        Promise.all([Item.find({}), Item.countDocumentsDeleted()])
            .then(([items, deletedCount]) =>
                res.render('me/stored-items', {
                    deletedCount: deletedCount,
                    items: mutipleMongooseToObject(items),
                }),
            )
            .catch(next);
    }
    //[GET] /me/trash/items
    trashItems(req, res, next) {
        Item.findDeleted({})
            .then((items) =>
                res.render('me/trash-items', {
                    items: mutipleMongooseToObject(items),
                }),
            )
            .catch(next);
    }
    myorder(req,res,next){
        Order.find({user:req.session.authUser},function(err,orders){
            if(err){
                return res.write('Error!');
            }
            var cart;
            orders.forEach(function(order){
                cart=new Cart(order.cart);
                order.items = cart.generateArray();
            });
            res.render('me/myorder',{orders:orders});
        });
    };
}

module.exports = new MeController();
