const express = require('express');
const router = express.Router();
const cheakAuth = require('../middeleware/check-auth');
const OrderController = require('../controllers/orders');

router.get('/', cheakAuth, OrderController.orders_get_all);

router.post('/', cheakAuth, OrderController.orders_post_data);

router.get('/:ordersId', cheakAuth, OrderController.order_get_one);

router.delete('/:ordersId', cheakAuth, OrderController.order_deleted);


module.exports = router;