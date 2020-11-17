const express = require('express');
const router = new express.Router();
const Company = require('../models/company');

const auth = require('../middleware/auth')


router.post('/company', auth, async (req, res) => {
    const company = new Company({
        ...req.body,
        owner: req.user._id
    })
    
    try{
        await company.save()
        res.status(201).send(company)
    } catch(error){
        res.status(400).send(error)
    }
})

router.get('/company', auth, async (req, res) => {
    try {
        const company = await Company.find(req.query)
        await req.user.populate({
            path: 'companyOwner',
        }).execPopulate()
        res.status(200).send(req.user.companyOwner)
    } catch(error) {
        res.status(500).send(error)
    }
})

router.get('/company/:id', auth, async (req, res) => {
    try {
        const company = await Company.findOne({_id: req.params.id, owner: req.user._id});
        if(!company) { 
            res.status(404).send({error: 'Not found pls check'})
        }
        res.status(200).send(company)
    } catch(error) {
        res.status(500).send(error)
    }
})

router.patch('/company/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','description','locationLink','welkomeMessage'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if(!isValidOperation) {
        res.status(400).send({error: 'Ivalid keys are responce'})
    }

    try {
        const company = await Company.findOne({_id: req.params.id, owner: req.user._id});

        updates.forEach(update => company[update] = req.body[update])
        await company.save()
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true, 
        //     runValidators: true
        // })
        if(!company) { 
            res.status(404).send({error: 'Not found^ pls check'})
        }
        res.status(200).send(company)
    } catch(error) {
        res.status(500).send(error)
    }
})

router.delete('/company/:id', auth, async (req, res) => {
    try {
        const company = await Company.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!company) { 
            return res.status(404).send()
        }
        res.status(204).send(company)
    } catch(error) {
        res.status(500).send(error)
    }
})



module.exports = router