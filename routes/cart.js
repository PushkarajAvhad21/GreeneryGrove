const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart');

router.get('/get/:userId', cartController.getCart);
router.get('/:userId', cartController.showcart);
router.post('/:userId', cartController.addItemToCart);
router.delete('/:userId/:plantId', cartController.removeItemFromCart);

module.exports = router;
