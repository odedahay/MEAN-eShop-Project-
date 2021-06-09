const express = require('express');
const router = express.Router();

const {Order} = require('../models/order');

router.get('/', async (req, res)=>{
    const orderlist = await Order.find();

    if(!orderlist){
        res.status(500).json({success: false})
    }
    res.send(orderlist);
});

module.exports = router;