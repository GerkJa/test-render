const express = require('express')
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const router = express.Router()
const prisma = new PrismaClient()

//Register new user
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12) //password+salt
        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
                name: req.body.name
            }
        })
        const user = await prisma.user.findUnique({
            where: {email: req.body.email}
        })
        const token = await jwt.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '30d'})

    res.send({msg: "Login OK", jwt: token})
    } catch (error) {
        console.log(error)
        res.status(500).send({msg: "Error: Creating user failed"})
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
        where: { email: req.body.email }
    })

    if (user === null) {
        console.log('no user found')
        return res.status(401).send({msg: "Authentication failed"})
    }

    const match = await bcrypt.compare(req.body.password, user.password)

    if (!match) {
        console.log('bad password')
        return res.status(401).send({msg: "Authentication failed"})
    }
    
    const token = await jwt.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '30d'})

    res.send({msg: "Login OK", jwt: token})
    } catch (error) {
        console.log(error)
        res.status(500).send({msg: "Error :("})
    }

    
})

router.post('/', async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12)

        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hashedPassword // hash av lösenordet
                
            }
        })  

        res.json({msg: "New user created", id: newUser.id})

    } catch (error) {
        console.log(error)
        res.status(500).send({msg: "Error: Create user failed"})
    }

})


module.exports = router