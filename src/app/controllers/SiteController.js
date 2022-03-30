const Item = require('../models/Item');
const { mutipleMongooseToObject } = require('../../util/mongoose');
class SiteController {
    //[GET] /
    home(req, res, next) {
        //console.log(req.session.authUser)
        var successMsg = req.flash('success')[0];
        Item.find({})
            .then((items) => {
                res.render('home', {
                    items: mutipleMongooseToObject(items),
                    successMsg: successMsg,
                    noMessages:!successMsg,
                });
            })
            .catch(next);
    }
}

module.exports = new SiteController();
