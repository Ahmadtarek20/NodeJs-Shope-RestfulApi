const mongoose = require('mongoose');
const multer = require('multer');
const Product = require('../models/product');


exports.product_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(all => {
            const response = {
                const: all.length,
                products: all.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            // if (all.length >= 0) {
            res.status(200).json(response);
            // } else {
            //    res.status(404).json({
            //        message: 'No entries Found'
            //    });
            //  }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.product_post_data = (req, res, next) => {
    //console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
            console.log(result);
            res.status(201).json({
                massage: 'Created Product Successfuly',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}
exports.product_get_one = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("From Data", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'
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

exports.product_updat_data = (req, res, next) => {
    const id = req.params.productId;
    const updatOps = {}; // OR
    for (const ops of req.body) {
        updatOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updatOps }) // Or >> { name: req.body.newName, price: req.body.newPrice }
        .select('name price _id')
        .exec()
        .then(results => {
            console.log(results);
            res.status(200).json({
                message: "Product Updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
}

exports.product_deleted = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(dox => {
            res.status(200).json({
                message: "Product Deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
            console.log(dox);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}