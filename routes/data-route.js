const router = require('express').Router();
const { Random } = require('../models/testData')

router.get('/', async (req, res) => {
    await Random.find({})
        .then((data) => res.status(200).send(data))
        .catch((err) => res.status(500).send(err.message))
})

router.get('/info', async (req, res) => {
    res.status(200).send([
        { name: 'Flow 1', flow: 300 },
        { name: 'Flow 2', flow: 350 },
        { name: 'Flow 3', flow: 400 }
    ])
})

router.post('/', async (req, res) => {
    await Random.create({ temp: req.body.temp })
        .then((data) => res.status(201).send([...data]))
        .catch((err) => res.status(500).send(err.message))
})

module.exports = { dataRoute: router };
