require('dotenv').config()
const jwt = require('jsonwebtoken')
const authenticationToken = (req,res,next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token ==null){
        return res.status(401).send('Unauthorized')
    }
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,response) => {
        if(err){
            return res.status(403)
        }
        res.locals = response
        next()
    })
}
module.exports = {
    authenticationToken
}