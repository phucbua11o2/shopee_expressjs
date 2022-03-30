const meRouter = require('./me');
const siteRouter = require('./site');
const itemsRouter = require('./items');
const accountsRouter = require('./accounts');
const cartsRouter = require('./carts');

function route(app) {
    app.use('/me', meRouter);
    app.use('/items', itemsRouter);
    app.use('/accounts', accountsRouter);
    app.use('/carts', cartsRouter);
    app.use('/', siteRouter);
}

module.exports = route;
