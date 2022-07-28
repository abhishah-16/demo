require('dotenv').config()
const checkRole = (req, res, next) => {
    if (res.locals.role == process.env.USER) {
        res.status(401).send('Unauthorized role')
    } else {
        next()
    }
}
module.exports = {
    checkRole
}