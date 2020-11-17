const express = require('express');
const router = new express.Router();
const Product = require('../models/product');

const auth = require('../middleware/auth')


router.post('/product', auth, async (req, res) => {

    // const task =  new Task(req.body)
    const product = new Product({
        ...req.body,
        owner: req.user._id
        // section_id: req.section._id
    })

    try {
        await product.save()
        res.status(201).send(product)
    } catch (error) {
        res.status(400).send(error)
    }
    // task.save().then(() => res.send(task))
    // .catch((error) => {
    //     res.status(400).send(error)
    // })
})


// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/product', auth, async (req, res) => {

    const match = {}

    if (req.query.section_id) {
        match.section_id = req.query.section_id
    }
    
    try {
        // const products = await Product.find(req.query);
        await req.user.populate({
            path: 'productOwner',
            match
        }).execPopulate()

        // await req.user.productOwner.populate({
        //     path: 'products'
        // }).execPopulate()
        
        res.send(req.user.productOwner)
    } catch {
        res.status(500).send('cannot check all products')
    }
   


    // console.log(Task)
    // Task.find({}).then(tasks => {
    //     res.send(tasks)
    // }).catch(() => {
    //     res.status(500).send('u here ') 
    // })
})

router.get('/product/:id', auth, async (req, res) => {
    try {
        const product = await Product.findOne({_id: req.params.id, owner: req.user._id});
        if(!product) { 
            res.status(404).send({error: 'Not fo und pls check'})
        }
        res.status(200).send(product)
    } catch {
        res.status(500).send('cannot check all products')
    }
})

router.patch('/product/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','name','type','price'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if(!isValidOperation) {
        res.status(400).send({error: 'Ivalid keys are responce'})
    }

    try{
        const product = await Product.findOne({_id: req.params.id, owner: req.user._id});

        updates.forEach(update => product[update] = req.body[update])
        await product.save()
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true, 
        //     runValidators: true
        // })
        if(!product) { 
            res.status(404).send({error: 'Not found^ pls check'})
        }
        res.status(200).send(product)
    }
    catch(error) { 
        res.status(500).send(error)
    }

})

router.delete('/product/:id', auth, async (req, res) => {
    try{
        const product = await Product.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        // const product = await Product.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!product) { 
            return res.status(404).send()
        }
        res.status(204).send(product)
    }  catch (error) {
        res.status(500).send(error)
    }
})



module.exports = router;