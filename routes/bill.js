require('dotenv').config()
const express = require('express')
const connection = require('../connection')
const router = express.Router()
const auth = require('../services/authentication')
const ejs = require('ejs')
const pdf = require('html-pdf')
const path = require('path')
const fs = require('fs')
const uuid = require('uuid')

// generate report
router.post('/report', auth.authenticationToken, (req, res) => {
    const generateuuid = uuid.v1()
    const orderDetails = req.body
    const productdetailsreport = JSON.parse(orderDetails.productDetails)
    query = `insert into bill(name,uuid,email,contactnumber,paymentmethod,total,productDetail,createdBy) values ($1,$2,$3,$4,$5,$6,$7,$8)`
    connection.query(query, [
        orderDetails.name,
        generateuuid,
        orderDetails.email,
        orderDetails.contactnumber,
        orderDetails.paymentmethod,
        orderDetails.totalAmount,
        orderDetails.productDetails,
        res.locals.email], (err, result) => {
            if (!err) {
                ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
                    productDetails: productdetailsreport,
                    name: orderDetails.name,
                    email: orderDetails.email,
                    contactnumber: orderDetails.contactnumber,
                    paymentmethod: orderDetails.paymentmethod,
                    totalAmount: orderDetails.totalAmount,
                }, (err, result) => {
                    if (err) {
                        return res.status(500).send(err)
                    } else {
                        pdf.create(result).toFile('./generated-pdf/' + generateuuid + '.pdf', (err, data) => {
                            if (err) {
                                console.log(err)
                            } else {
                                return res.status(200).send({ uuid: generateuuid })
                            }
                        })
                    }
                })
            } else {
                return res.status(500).send(err)
            }
        })
})

// getpdf
router.post('/getpdf', auth.authenticationToken, (req, res) => {
    const orderDetails = req.body
    const pdfPath = './generated-pdf/' + orderDetails.uuid + '.pdf'
    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf")
        fs.createReadStream(pdfPath).pipe(res)
    } else {
        const productDetailsreport = JSON.parse(orderDetails.productDetails)
        ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
            productDetails: productdetailsreport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactnumber: orderDetails.contactnumber,
            paymentmethod: orderDetails.paymentmethod,
            totalAmount: orderDetails.totalAmount,
        }, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            } else {
                pdf.create(result).toFile('./generated-pdf/' + orderDetails.uuid + '.pdf', (err, data) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.contentType("application/pdf")
                        fs.createReadStream(pdfPath).pipe(res)
                    }
                })
            }
        })
    }
})

// getall bill
router.get('/getbill', auth.authenticationToken, (req, res) => {
    query = `select * from bill order by id DESC`
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).send(result.rows)
        } else {
            return res.status(500).send(err)
        }
    })
})

// delete bill
router.delete('/delete/:id', auth.authenticationToken, (req, res) => {
    const id = req.params.id
    query = `delete from bill where id=$1`
    connection.query(query, [id], (err, result) => {
        if (!err) {
            if (result.rowCount == 0) {
                return res.status(400).send('Bill not found')
            }
            return res.status(200).send('Bill Deleted Successfully')
        } else {
            return res.status(500).send(err)
        }
    })
})
module.exports = router