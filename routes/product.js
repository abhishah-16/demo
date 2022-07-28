require('dotenv').config()
const express = require('express')
const connection = require('../connection')
const router = express.Router()
const auth = require('../services/authentication')
const checkRole = require('../services/checkrole')

// create product
router.post('/create', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const product = req.body
    query = `INSERT INTO product(name,categoryid,description,price,status) VALUES($1,$2,$3,$4,$5)`
    connection.query(query, [product.name, product.categoryid, product.description, product.price, 'true'], (err, result) => {
        if (!err) {
            return res.status(201).send('Product Created Successfully')
        } else {
            return res.status(500).send(err)
        }
    })
})

// getall product
router.get('/get', auth.authenticationToken, (req, res) => {
    query = `select p.id,p.name,p.description,p.price,p.status,c.id as categoryid,c.name as categoryName from product as p INNER JOIN category as c on p.categoryid = c.id`
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).send(result.rows)
        } else {
            return res.status(500).send(err)
        }
    })
})

// get product by categoryid
router.get('/getbycategory/:id', auth.authenticationToken, (req, res) => {
    const id = req.params.id
    query = `select id,name from product where categoryid=$1 and status='true'`;
    connection.query(query, [id], (err, result) => {
        if (!err) {
            return res.status(200).send(result.rows)
        } else {
            return res.status(500).send(err)
        }
    })
})

// get product by product id
router.get('/getbyid/:id', auth.authenticationToken, (req, res) => {
    const id = req.params.id
    query = `select * from product where id=$1`
    connection.query(query, [id], (err, result) => {
        if (!err) {
            if (result.rows.length == 0) {
                return res.status(404).send('Product not found')
            } else {
                return res.status(200).send(result.rows)
            }
        } else {
            return res.status(500).send(err)
        }
    })
})

// update product
router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const product = req.body
    query = `update product set name=$1,categoryid=$2,description=$3,price=$4 where id=$5`
    connection.query(query, [product.name, product.categoryid, product.description, product.price, product.id], (err, result) => {
        if (!err) {
            if (result.affetedRows == 0) {
                return res.status(404).send('Product not found')
            }
            return res.status(200).send('Product updated successfully')
        } else {
            return res.status(500).send(err)
        }
    })
})

// delete product
router.delete('/delete/:id', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const id = req.params.id
    query = `delete from product where id=$1`
    connection.query(query, [id], (err, result) => {
        if (!err) {

            // console.log(result)
            if (result.rowCount == 0) {
                return res.status(404).send('Product not found')
            }
            return res.status(200).send('Product Deleted Successfully')
        } else {
            return res.status(500).send(err)
        }
    })
})

// change status update
router.patch('/update/status', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const product = req.body
    query = `update product set status =$1 where id =$2`
    connection.query(query, [product.status, product.id], (err, result) => {
        if (!err) {
            if (result.affetedRows == 0) {
                return res.status(400).send('Product not found')
            }
            return res.status(200).send('Product status updated Successfully')
        } else {
            return res.status(500).send(err)
        }
    })
})
module.exports = router