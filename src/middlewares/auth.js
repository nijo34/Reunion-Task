const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config/index')
const { PrismaClient } = require ('@prisma/client')

const prisma = new PrismaClient()

const auth = async ( req , res , next) =>{
    try {
        const token = req.header('Authorization').replace('Bearer ' , '')
        const decoded = jwt.verify(token , JWT_SECRET)
        const user = await prisma.user.findUnique({where : {email : decoded.email }})
        
        if(!user){
            return res.status(404).json({
                status : false,
                msg: 'User already logged out'
            })
        }

        req.token = token
        req.user = user

        next()
    }
    catch(e) {
        res.status(401).json({
            status:false,
            msg: 'Unauthenticated login',
            e
        })
    }
}

module.exports = auth
