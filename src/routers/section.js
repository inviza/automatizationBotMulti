const express = require('express');
const router = new express.Router();
const Section = require('../models/section');

const auth = require('../middleware/auth')


router.post('/section', auth, async (req, res) => {
    const section = new Section({
        ...req.body,
        owner: req.user._id
    })
    
    try{
        await section.save()
        res.status(201).send(section)
    } catch(error){
        res.status(400).send(error)
    }
})

router.get('/section', auth, async (req, res) => {

    // const match = {}
    // const sort = {}

    // if (req.query.section_id) {
    //     match.section_id = req.query.section_id
    // }

    try {
        // const tasks = await Task.find({owner: req.user._id});
        await req.user.populate({
            path: 'sectionOwner',
            // match
        }).execPopulate()
        res.send(req.user.sectionOwner)
    } catch (error) {
        res.status(500).send('cannot check all users')
    }
    // try {
    //     const sections = await Section.find(req.query)
    //     res.status(200).send(sections)
    // } catch(error) {
    //     res.status(500).send(error)
    // }
})

router.get('/section/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const sections = await Section.findOne({_id: req.params.id, owner: req.user._id});
        if(!sections) { 
            res.status(404).send({error: 'Not fo und pls check'})
        }
        res.status(200).send(sections)
    } catch(error) {
        res.status(500).send(error)
    }
})

router.patch('/section/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if(!isValidOperation) {
        res.status(400).send({error: 'Ivalid keys are responce'})
    }

    try {
        const section = await Section.findOne({_id: req.params.id, owner: req.user._id});

        updates.forEach(update => section[update] = req.body[update])
        await section.save()
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true, 
        //     runValidators: true
        // })
        if(!section) { 
            res.status(404).send({error: 'Not found^ pls check'})
        }
        res.status(200).send(section)
    } catch(error) {
        res.status(500).send(error)
    }
})

router.delete('/section/:id', auth, async (req, res) => {
    try {
        const section = await Section.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!section) { 
            return res.status(404).send()
        }
        res.status(204).send(section)
    } catch(error) {
        res.status(500).send(error)
    }
})



module.exports = router