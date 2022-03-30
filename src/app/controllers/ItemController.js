const Item = require('../models/Item');
const { mongooseToObject } = require('../../util/mongoose');
class ItemController {
    //[GET] /items/:slug
    show(req, res, next) {
        Item.findOne({ slug: req.params.slug })
            .then((item) => {
                res.render('items/show', { item: mongooseToObject(item) });
            })
            .catch(next);
    }
    //[GET] /items/create
    create(req, res, next) {
        res.render('items/create');
    }
    //[POST] /items/store
    store(req, res, next) {
        const item = new Item(req.body);
        item.save()
            .then(() => res.redirect('/me/stored/items'))
            .catch(next);
    }
    //[GET] /items/:id/edit
    edit(req, res, next) {
        Item.findById(req.params.id)
            .then((item) =>
                res.render('items/edit', {
                    item: mongooseToObject(item),
                }),
            )
            .catch(next);
    }
    //[PUT] /items/:id
    update(req, res, next) {
        Item.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/items'))
            .catch(next);
    }
    //[DELETE] /items/:id
    delete(req, res, next) {
        Item.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[DELETE] /items/:id/destroy
    destroy(req, res, next) {
        Item.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[PATCH] /items/:id/restore
    restore(req, res, next) {
        Item.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[POST] /items/handle-form-actions
    handleFormAction(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Item.delete({ _id: { $in: req.body.itemcheckboxIDs } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action invalid!' });
        }
    }
    //[POST] /items/handle-trash-form-actions
    handleTrashFormActions(req, res, next) {
        switch (req.body.action) {
            case 'restore':
                Item.restore({ _id: { $in: req.body.itemcheckboxIDs } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'destroy':
                Item.deleteOne({ _id: { $in: req.params.itemcheckboxIDs } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action invalid!' });
        }
    }
}

module.exports = new ItemController();
