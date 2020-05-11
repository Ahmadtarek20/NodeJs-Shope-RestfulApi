const express = require('express');
const app = express();
const morgan = require('morgan');
const boudyParser = require('body-parser');
const mongoose = require('mongoose');


const routerproduct = require('./api/routes/products');
const routerorder = require('./api/routes/orders');
const routeruser = require('./api/routes/users');


mongoose.connect('mongodb://localhost:27017/Rest-Api');

mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(boudyParser.urlencoded({ extended: false }));
app.use(boudyParser.json());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Headers', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
//Routs which shoud handle request
app.use('/products', routerproduct);
app.use('/orders', routerorder);
app.use('/user', routeruser);


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404; // status(404)
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;