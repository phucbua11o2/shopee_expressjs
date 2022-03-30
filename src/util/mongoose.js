module.exports = {
    mutipleMongooseToObject: function (mongooseArrays) {
        return mongooseArrays.map((mongooseArrays) =>
            mongooseArrays.toObject(),
        );
    },
    mongooseToObject: function (mongooseArray) {
        return mongooseArray ? mongooseArray.toObject() : mongooseArray;
    },
};
