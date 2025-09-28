const express = require('express')
const { PrismaClient } = require('@prisma/client')
const authorize = require('../middleware/authorize')

const router = express.Router()
const prisma = new PrismaClient()

//router.use(authorize)

router.get('/', authorize, async (req, res) => {
    try {
        const notes = await prisma.notes.findMany({
            where: { author_id: req.authUser.sub } 
        })
        res.json(notes)
    } catch (error) {
        console.log(error)
        res.status(500).send({msg: "Error"})
    }
})

router.post('/', authorize, async (req, res) => {
    try {
        const newNote = await prisma.notes.create({
            data: {
                author_id: req.authUser.sub,
                note: req.body.text,
                unique_id: req.body.unique_id,
                color: req.body.color,
                position_x: req.body.x,
                position_y: req.body.y
            }
        })  

        res.json({msg: "New note created", id: newNote.id})

    } catch (error) {
        console.log(error)
        res.status(500).send({msg: "Error: POST failed"})
    }
})

router.put('/updateAll', authorize, async (req, res) => {
    try {
        const updates = req.body.notes;

        const upd = updates.map(note => prisma.notes.update({
            where: { unique_id: note.unique_id, author_id: req.authUser.sub},
            data: {
                note: note.text,
                color: note.color,
                position_x: note.x,
                position_y: note.y
            }
        }))

        await Promise.all(upd)
        res.json({ msg: "Notes updates" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error updating notes" })
    }
})

router.delete('/:id', authorize, async (req,res) => {
    try {
        await prisma.notes.delete({
            where: {unique_id: req.params.id}
        })
        res.json({ msg: 'Note deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Failed to delete note' });
    }
})

module.exports = router