const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoute = require('./api/routes/products');
const orderRoute = require('./api/routes/orders');

mongoose.connect("mongodb://node-shop:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-shop-shard-00-00-r8sg8.mongodb.net:27017,node-rest-shop-shard-00-01-r8sg8.mongodb.net:27017,node-rest-shop-shard-00-02-r8sg8.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true",
    {
    useMongoClient: true
    }
);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({exteded: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products',productRoute);
app.use('/orders',orderRoute);

app.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error :{
            message: error.message
        }
    });

});

module.exports = app;