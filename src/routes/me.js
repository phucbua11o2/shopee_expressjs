const express = require('express');
const router = express.Router();
const restrict = require('../middlewares/auth.mdw');

const meController = require('../app/controllers/MeController');

router.get('/stored/items', meController.storedItems);
router.get('/trash/items', meController.trashItems);
router.get('/myorder', restrict,meController.myorder);

module.exports = router;
