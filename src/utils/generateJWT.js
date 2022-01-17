const jwt = require('jsonwebtoken')
const config = require('../../config/index')

const generateAccessToken = ( email ) =>{

    const token = jwt.sign({
        email
    },
    config.JWT_SECRET,
    {
        expiresIn: '15h'
    })

    return token
}

module.exports = generateAccessToken