const express = require('express');
const app = express();

const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');
const api = process.env.API_URL
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

// Product Routers  
const categoriesRouter = require('./routers/categories');
const productsRouter = require('./routers/products');
const orderRoutes = require('./routers/orders');
const userRoutes = require('./routers/users');

app.use(cors());
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

// Routers
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/orders`, orderRoutes);
app.use(`${api}/users`, userRoutes);

mongoose.connect(process.env.CONNECTION_STRING, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'eshop-database'
    })
    .then(()=>{
        console.log('Database Connection is ready...');
    })
    .catch((err)=>{
        console.log(err)
    })

app.listen(3000, ()=>{
    console.log('Server is running http://localhost:3000');
})