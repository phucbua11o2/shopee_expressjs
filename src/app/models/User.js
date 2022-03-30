const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const User = new Schema(
    {
        email: {type: String,default:''},
        username: {type: String,default:''},
        password: {type: String,default:''},
        confirmpass: {type: String,default:''},
        role: {type: Number,default: 1},
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('User', User);
