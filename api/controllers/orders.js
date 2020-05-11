const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');


exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('quantity product _id')
        .populate('product', 'name')
        .exec()
        .then(docx => {
            res.status(200).json({
                const: docx.length,
                orders: docx.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })

            });

        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.orders_post_data = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                res.status(404).json({
                    message: 'Product Not Found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                massage: 'Created Order is Done ',
                createdProduct: {
                    quantity: result.quantity,
                    product: result.productId,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.order_get_one = (req, res, next) => {
    const id = req.params.ordersId;
    Order.findById(id)
        .select('name price _id')
        .populate('product')
        .exec()
        .then(doc => {
            if (!doc) {
                return res.status(404).json({
                    message: 'Order Not found'
                });
            }
            console.log("From Data", doc);
            if (doc) {
                res.status(200).json({
                    order: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/'
                    }
                });

            } else {
                res.status(404).json({ message: 'Not Valid entry found For Id' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
}
exports.order_deleted = (req, res, next) => {
    const id = req.params.ordersId;
    Order.remove({ _id: id })
        .exec()
        .then(dox => {
            res.status(200).json({
                message: "Order Deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { quantity: 'Number', product: 'Number' }
                }
            });
            console.log(dox);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}