const mongoose = require('mongoose');
const bcrebt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    messege: 'Maill exists'
                })
            } else {
                bcrebt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    messege: "User created"
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}
exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth Fild'
                });
            }
            bcrebt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Fild'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id,
                        },
                        "secret Key", {
                            expiresIn: "1h"
                        });
                    return res.status(200).json({
                        message: 'Auth Sucsesfull',
                        token: token

                    });
                }
                res.status(401).json({
                    message: 'Auth Fild'
                });
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}
exports.user_deleted = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(dox => {
            res.status(200).json({
                message: "User Deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/user/signup',
                    body: { email: 'String', password: 'String' }
                }
            });
            console.log(dox);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}