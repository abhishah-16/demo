require('dotenv').config()
const express = require('express')
const connection = require('../connection')
const router = express.Router()
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const auth = require('../services/authentication')
const checkRole = require('../services/checkrole')

// sign up
router.post('/signup', (req, res) => {
    const user = req.body
    query = 'SELECT email,password,role,status  FROM "user" WHERE email=$1'
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            if (result.rows.length <= 0) {
                query = 'INSERT INTO "user"(name,contactnumber,email,password,status,role) VALUES ($1,$2,$3,$4,$5,$6)'
                connection.query(query, [user.name, user.contactnumber, user.email, user.password, "false", "user"], (err, result) => {
                    if (!err) {
                        return res.status(201).send('success! user created successfully')
                    } else {
                        return res.status(500).send(err)
                    }
                })
            }
            else {
                return res.status(400).send('email already exist')
            }
        }
        else {
            return res.status(500).send(err)
        }
    })
})

// login
router.post('/login', (req, res) => {
    const user = req.body;
    query = 'select email,password,role,status from "user" where email=$1'
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            if (result.rows.length <= 0 || result.rows[0].password != user.password) {
                return res.status(401).send('Incorrect username or password')
            }
            else if (result.rows[0].status === 'false') {
                return res.status(401).send('Admin Approval is Pending')
            }
            else if (result.rows[0].password == user.password) {
                const response = {
                    email: result.rows[0].email,
                    role: result.rows[0].role
                }
                const accesstoken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '15h' })
                return res.status(200).send({ token: accesstoken })
            }
            else {
                return res.status(400).send('Something went wrong. Please try again later!')
            }
        } else {
            return res.status(500).send(err)
        }
    })
})
// get all user
router.get('/get', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    query = `select id,name,contactnumber,status from "user" where role!='admin'`
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).send(result.rows)
        } else {
            return res.status(500).send(err)
        }
    })
})

// update user
router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const user = req.body
    query = `update "user" set status=$1 where id=$2`
    connection.query(query, [user.status, user.id], (err, result) => {
        if (!err) {
            if (result.affetedRows == 0) {
                return res.status(404).send('user does not exist')
            }
            return res.status(200).send('user updated successfully')
        } else {
            return res.status(500).send(err)
        }
    })
})

// checktoken
router.get('/checktoken', auth.authenticationToken, (req, res) => {
    return res.status(200).send('true')
})

// reset password
router.post('/changepassword', auth.authenticationToken, (req, res) => {
    const user = req.body
    const email = res.locals.email
    console.log(email)

    query = `select * from "user" where email=$1 and password=$2`
    connection.query(query, [user.email, user.oldpassword], (err, result) => {
        if (!err) {
            if (result.rows.length <= 0) {
                return res.status(400).send('Incorrect old Password')
            }
            else if (result.rows[0].password == user.oldpassword) {
                query = `update "user" set password=$1 where email=$2`
                connection.query(query, [user.newpassword, user.email], (err, result) => {
                    if (!err) {
                        return res.status(200).send('Password updated successfully')
                    } else {
                        return res.status(500).send(err)
                    }
                })
            } else {
                return res.status(400).send('Something went WRONG! ')
            }
        } else {
            return res.status(500).send(err)
        }
    })
})
// forgot password
router.post('/forgotpassword', (req, res) => {
    const user = req.body
    query = 'select email,password from "user" where email=$1'
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            if (result.rows.length <= 0) {
                return res.status(200).send('Password send successfully to your mail')
            } else {
                const mailconfig = {
                    from: process.env.EMAIL,
                    to: result.rows[0].email,
                    subject: 'Password by Cafe Management System',
                    html: '<p><b>Your Login details for Cafe Management System</b><br><b>Email: </b>' + result.rows[0].email + '<br><b>Password: </b>' + result.rows[0].password + '<br><a href="http://localhost:4200/">Click here to Login</a></p>'
                }
                transporter.sendMail(mailconfig, (err, info) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(info.response)
                    }
                })
                return res.status(200).send('Password send successfully to your mail')
            }
        } else {
            return res.status(500).send(err)
        }
    })
})
// mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

module.exports = router