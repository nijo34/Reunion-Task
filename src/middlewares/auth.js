const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config/index')
const { PrismaClient } = require ('@prisma/client')

const prisma = new PrismaClient()

const auth = async ( req , res , next) =>{
    try {
        const token = req.header('Authorization').replace('Bearer ' , '')
        const decoded = jwt.verify(token , '70714fc0c04294b06153343454c68fc9544b1b8d8050365f89529e0b67b127020d122de259e1d3c622c4c7cf4d7c7a9a7c15fc5b0445d9481c415f6a3411ecdd')
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
