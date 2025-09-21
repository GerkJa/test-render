const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

    //ersätts med riktig data från db
const tempData = [
    {Nummer: "ett"},
    {Nummer: "två"},
    {Nummer: "tre"}
]

router.get('/', async (req, res) => {
    try {
        const notes = await prisma.notes.findMany()
        res.json(notes)
    } catch (error) {
        console.log(error)
        res.status(500).send({msg: "Error"})
    }
})
// POST ---     SQL INSERT INTO....
router.post('/', async (req, res) => {
    
    try {
        const newNote = await prisma.notes.create({
            data: {
                author_id: 1,
                note: req.body.text
            }
    })

    res.json({msg: "new note created", newNote: newNote})

    } catch (error) {
        console.log(error)
        res.status(500).send({msg: "Error"})
    }
})

router.put('/:id', (req, res) => {
    //SQL UPDATE ... WHERE id = :id
    tempData[req.params.id] = req.body
    res.send({ method: req.method, body: req.body})
})

router.delete('/:id', (req, res) => {
    //SQL: DELETE FROM notes WHERE id = :id

    tempData.splice(req.params.id, 1)
    res.send({ 
        method: req.method,
        msg: `Deleted ${req.params.id}`
    })
})

module.exports = router