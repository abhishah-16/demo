require('dotenv').config()
const express = require('express')
const connection = require('../connection')
const router = express.Router()
const auth = require('../services/authentication')

// get details
router.get('/details', auth.authenticationToken, (req, res) => {
    var categorycount
    var productcount
    var billcount
    query = `select count(id) as categorycount from category`
    connection.query(query, (err, result) => {
        if (!err) {
            categorycount = result.rows[0].categorycount
        } else {
            return res.status(500).send(err)
        }
    })
    query = `select count(id) as productcount from product`
    connection.query(query, (err, result) => {
        if (!err) {
            productcount = result.rows[0].productcount
        } else {
            return res.status(500).send(err)
        }
    })
    query = `select count(id) as billcount from bill`
    connection.query(query, (err, result) => {
        if (!err) {
            billcount = result.rows[0].billcount
            const data = {
                category: categorycount,
                product: productcount,
                bill: billcount

            }
            return res.status(200).send(data)
        } else {
            return res.status(500).send(err)
        }
    })
})
module.exports = router