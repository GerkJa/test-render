const express = require('express')
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const router = express.Router()
const prisma = new PrismaClient()

// Onödig fil ta bort och använd authorize middleware!


//decode jwt to send back username and email

router.get('/decode', async (req, res) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
         return res.status(401).json({ msg: "No token provided" })
    }

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // save payload for later
    res.json({username: decoded.name, email: decoded.email})

  } catch (err) {
    return res.status(403).json({ msg: "Invalid token" });
  }
}) 
//Protect routes with Auth!!!
function authenticate(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) return res.status(401).json({ msg: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({msg: "Invalid token"})
            req.user = user
        next()
    })
} 
module.exports = router 