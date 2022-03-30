const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

const Order = new Schema(
    {
        user:{type: Schema.Types.ObjectId , ref:'User'},
        cart: {type: Object,require:true},
        addresses:{type:String,require:true},
        name: {type:String,require:true},
        paymentId: {type:String,require:true}
    }
);

module.exports = mongoose.model('Order', Order);
