const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

const {Product} = require('../models/product');

router.get(`/`, async (req, res)=>{
    // localhost:3000/api/v1/products?categories=2221,2221445
    let filter = {}
    if(req.query.categories)
    {
        filter = {category:req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category');
    //const productList = await Product.find(filter).select('name image');

    if(!productList){
        res.status(500).json({
            success: false
        })
    }
    res.send(productList)
});

router.get(`/:id`, async (req, res)=>{
    const product = await Product.findById(req.params.id).populate('category');

    if(!product) res.status(500).json({success: false})

    res.send(product);
})

router.post(`/`, async (req, res)=>{
    
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription:req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });
    
    product = await product.save();
    
    if(!product) return res.status(500).send('The product cannot be created');

    res.send(product);

    // Alternative approach
    // product.save()
    //     .then((createdProduct)=>{
    //         res.status(201).json(createdProduct)
    //     })
    //     .catch((err)=>{
    //         res.status(500).json(
    //             {error: err, success: false}
    //             )
    //     })

});

router.put('/:id', async(req, res)=>{

    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Product ID');
    }

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid category');

    const product = await Product.findByIdAndUpdate(req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription:req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            },
            {new: true}
        );

        if(!product){
            return res.status(404).send('The product cannot be update!');
        }
        res.send(product)
        
});

router.delete('/:id', (req, res)=>{
    Product.findByIdAndRemove(req.params.id)
        .then(product =>{
            if(product){
                return res.status(200).json({
                    success: true,
                    message: 'Product is deleted'
                })
            }else{
                return res.status(404).json({
                    success: false,
                    message: 'Product is not found'
                })
            }
        }).catch(err=>{
            return res.status(400).json({
                success:false,
                error: err
            })
        })
});

router.get('/get/count', async (req, res)=>{
    const productCount = await Product.countDocuments((count)=>{
        count
    })

    if(!productCount){
        res.status(400).json({success: false})
    }

    res.send({
        productCount: productCount
    })
});

router.get('/get/featured/:count', async (req, res)=>{
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({isFeatured: true}).limit(+count);

    if(!products){
        res.status(400).json({success: false})
    }

    res.send({
        products
    })
});

module.exports = router;
