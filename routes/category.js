// const { query } = require('express')
const express = require('express')
const connection = require('../connection')
const router = express.Router()
const auth = require('../services/authentication')
const checkRole = require('../services/checkrole')

// create category
router.post('/create', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const category = req.body
    query = `insert into category (name) values ($1)`
    connection.query(query, [category.name], (err, result) => {
        if (!err) {
            return res.status(201).send('category created successfully')
        } else {
            return res.status(500).send(err)
        }
    })
})

// getall category
router.get('/get', auth.authenticationToken, (req, res) => {
    query = `select * from category order by name;`
    connection.query(query, (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            return res.status(500).send(err)
        }
    })
})

// update category
router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const category = req.body
    query = `update category set name=$1 where id=$2 `
    connection.query(query, [category.name, category.id], (err, result) => {
        if (!err) {
            console.log(result.affectedRows)
            if (result.affectedRows == 0) {
                return res.status(404).send('category does not exist')
            }
            return res.status(200).send('category updated successfully')
        } else {
            return res.status(500).send(err)
        }
    })
})

module.exports = router