const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Item = new Schema(
    {
        img: { type: String, default: ' ' },
        description: { type: String, default: '' },
        priceOld: { type: Number, default: ' ' },
        priceNew: { type: Number, default: ' ' },
        producer: { type: String, default: ' ' },
        place: { type: String, default: ' ' },
        slug: { type: String, slug: 'description', unique: true },
    },
    {
        timestamps: true,
    },
);
//Add plugin
mongoose.plugin(slug);
Item.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
module.exports = mongoose.model('Item', Item);
