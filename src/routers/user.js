const express = require('express');
const router = new express.Router();
const User = require('../models/user');

const auth = require('../middleware/auth')


router.post('/users', async (req, res) => { 
 
    const user = new User(req.body)
    
    try {
        await user.save() 
        
        //! sendWelkomeEmail(user.email, user.name)
        const token = await user.generateAuthToken();
        
        res.status(201).send({ user, token })
    } catch(error) { 
        res.status(400).send(error)
    }

})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        
        res.send({ user, token })
    } catch(error) {
        res.status(500).send(error)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }
    catch (e) { 
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {

    //* me
    res.send(req.user)
})


router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates'});
    }

    try { 

        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true, 
        //     runValidators: true
        // })
        res.send(req.user)
    } catch (error) { 
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user) {
        //     return res.status(404).send()
        // }

        await req.user.remove()
        // sendCanselationEmail(req.user.email, req.user.name)
        res.status(204).send()
    } 
    catch (error) {
        res.status(500).send(error)
    }
})
module.exports = router