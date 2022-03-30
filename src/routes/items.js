const express = require('express');
const router = express.Router();

const itemController = require('../app/controllers/ItemController');

router.get('/create', itemController.create);
router.post('/store', itemController.store);
router.get('/:id/edit', itemController.edit);
router.post('/handle-form-actions', itemController.handleFormAction);
router.post(
    '/handle-trash-form-actions',
    itemController.handleTrashFormActions,
);
router.put('/:id/', itemController.update);
router.patch('/:id/restore', itemController.restore);
router.delete('/:id/', itemController.delete);
router.delete('/:id/destroy', itemController.destroy);
router.get('/:slug', itemController.show);

module.exports = router;
