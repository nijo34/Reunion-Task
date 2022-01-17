const { PrismaClient } = require ('@prisma/client')
const bcrypt = require('bcrypt')
const Logger = require('../logger/logger')
const generateAccessToken =  require('../utils/generateJWT')

const prisma = new PrismaClient()

const userRegister = async ( req , res) =>{
    try {
        const { email , password } = req.body

        const existUser = await prisma.user.findUnique({where:{ email }})

        if(existUser){
            return res.status(404).json({
                status:false,
                msg: 'Email is already taken!'
            })
        }

        const accessToken = generateAccessToken(email)

        const user = await prisma.user.create({
            data: {
                email,
                password : await bcrypt.hash(password,11)   ,
                accessToken
            }
        })        

        res.status(201).json({
            status: true,
            msg:'User created',
            user: serializeUser(user),
        })
        Logger.info('New user registered')
    }
    catch(e){
        console.log(e)
        Logger.error('Unable to register user')
        return res.status(500).json({
            status: false,
            msg: 'Unable to register user'
        })
    }
}

const loginUser = async ( req , res ) => {
    try{
        const userDetails = req.body
        const email = userDetails.email
        const password = userDetails.password

        const user = await prisma.user.findUnique({where:{email}})

        if(!user){
            Logger.error('Invalid login credentials')
            return res.status(404).json({
                status: false,
                msg: "No user found. Invalid login credentials."
            })
        }

        const isMatch = await bcrypt.compare( password , user.password)

        if(isMatch){
            const accessToken = generateAccessToken(email)
            const updatedUser = await prisma.user.update({
                where :{
                    email : user.email,
                },
                data : {
                    accessToken 
                }
            })

            return res.json({
                status : true,
                msg: 'User logged in',
                user: serializeUser(updatedUser)
            })
        }
        else{
            return res.status(400).json({
                status : true,
                msg: 'Incorrect password!'          
            })
        }
    }
    catch(e){
        console.log(e)
        Logger.error('Unable to login user')
        return res.status(500).json({
            status: false,
            msg: 'Unable to login user'
        })
    } 
}

const followUser =  async ( req , res ) => {
    try {
        const following_id = req.params.id
        const follower_id = req.user.user_id

        const alreadyFollows = await prisma.follow.findMany({ 
            where : {
                AND : [
                    {
                        following_id : {
                            equals : parseInt(following_id)
                        }
                    },
                    {
                        follower_id : {
                            equals : parseInt(follower_id)
                        }
                    }
                ]
            }
        })

        if(alreadyFollows.length!==0){
            return res.status(400).json({
                status: false,
                msg : 'Already follows the desired user!'
            })
        }

        const follow = await prisma.follow.create({
            data : {
                follower_id,
                user : {
                    connect : {
                        user_id : parseInt(following_id)
                    }
                }
            }
        })

        const following = await prisma.user.findUnique({where : {user_id : parseInt(following_id)}})
        if(!following){
            return res.status(400).json({
                status : false,
                msg : 'Unable to find user!'
            })
        }

        res.json({
            status : true,
            msg : `Following ${following.email}`
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status : false, 
            msg:'Unable to follow'
        })
    }
}

const unfollowUser = async ( req , res ) => {
    try { 
        const following_id = req.params.id
        const follower_id = req.user.user_id

        const unfollow = await prisma.follow.deleteMany({
            where : {
                AND : [
                    {
                        following_id : {
                            equals : parseInt(following_id)
                        }
                    },
                    {
                        follower_id : {
                            equals : parseInt(follower_id)
                        }
                    }
                ]
            }
        })
        res.json({
            status : true,
            msg : `Unfollowed the desired user`
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status: false,
            msg: 'Error unfollowing'
        })
    }
}

const getProfile = async ( req , res ) => {
    try{ 
        const following = await prisma.follow.count({
            where : {
                follower_id : {
                    equals : parseInt(req.user.user_id)
                }
            }
        })

        const followers = await prisma.follow.count({
            where : {
                following_id : {
                    equals : parseInt(req.user.user_id)
                }
            }
        })

        res.json({
            status : true,
            msg : 'User Profile',
            id: req.user.user_id,
            email: req.user.email,
            following,
            followers
        })
    }
    catch(e){
        return res.status(500).json({
            status: false,
            msg: 'Cannot get profile of user'
        })
    }
}

const createPost = async ( req , res ) => {
    try {
        const { title , description} = req.body
        const post = await prisma.post.create({
            data :{
                title,
                description,
                user : {
                    connect : {
                        user_id : parseInt(req.user.user_id)
                    }
                }
            }
        })

        res.status(201).json({
            status: true,
            msg: 'Post created!',
            post
        })
    }
    catch(e){
        return res.status(500).json({
            status : false,
            msg: 'Cannot create post'
        })
    }
}

const deletePost = async ( req  , res ) => {
    try{
        const post_id = req.params.id
        const user_id = req.user.user_id

        const post = await prisma.post.deleteMany({
            where : {
                AND : [
                    {
                        post_id : {
                            equals : parseInt(post_id)
                        }
                    },
                    {
                        user_id : {
                            equals : parseInt(user_id)
                        }
                    }
                ]
            }
        })

        res.json({
            status : true,
            msg : `Deleted the desired post`
        })

    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status: false,
            msg: 'Error deleting the post!'
        })
    }
}

const likePost = async ( req, res ) => {
    try{
        const post_id = req.params.id
        const user_id = req.user.user_id

        const alreadyLiked = await prisma.like.findMany({ 
            where : {
                AND : [
                    {
                        post_id : {
                            equals : parseInt(post_id)
                        }
                    },
                    {
                        user_id : {
                            equals : parseInt(user_id)
                        }
                    }
                ]
            }
        })

        if(alreadyLiked.length!==0){
            return res.status(400).json({
                status: false,
                msg : 'Already liked the desired post!'
            })
        }

        const likePost = await prisma.like.create({
            data : {
                user : {
                    connect : {
                        user_id : parseInt(user_id)
                    }
                },
                post : {
                    connect : {
                        post_id : parseInt(post_id)
                    }
                }
            }
        })
        console.log(likePost)
        res.status(200).json({
            status: true,
            msg: 'Post liked!',
            likePost
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status : false,
            msg: 'Cannot like post'
        })
    }
}

const unlikePost = async ( req , res ) => {
    try { 
        const post_id = req.params.id
        const user_id = req.user.user_id

        const post = await prisma.like.deleteMany({
            where : {
                AND : [
                    {
                        post_id : {
                            equals : parseInt(post_id)
                        }
                    },
                    {
                        user_id : {
                            equals : parseInt(user_id)
                        }
                    }
                ]
            }
        })
        res.json({
            status : true,
            msg : `unliked the desired post`
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status: false,
            msg: 'Error unliking the post!'
        })
    }
}

const commentPost = async ( req , res ) => {
    try{
        const post_id = req.params.id
        const user_id = req.user.user_id
        const content = req.body.comment

        const comment = await prisma.comment.create({
            data : {
                content,
                user : {
                    connect : {
                        user_id : parseInt(user_id)
                    }
                },
                post : {
                    connect : {
                        post_id : parseInt(post_id)
                    }
                }
            }
        })
        res.status(200).json({
            status: true,
            msg: 'Post commented on!',
            comment
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status : false,
            msg: 'Cannot comment on post'
        })
    }
}

const viewPost = async ( req , res ) => {
    try{
        const post_id = req.params.id

        const post = await prisma.post.findUnique({where : { post_id : parseInt(post_id) }})
        if(!post){
            return res.status(400).json({
                status: true,
                msg: 'Did not find any post!'
            })
        }
        const likes = await prisma.like.count({
            where : {
                post_id : {
                    equals : parseInt(post_id)
                }
            }
        })

        const comments = await prisma.comment.count({
            where : {
                post_id : {
                    equals : parseInt(post_id)
                }
            }
        })

        res.json({
            status : true,
            msg : 'Post displayed',
            post,
            likes,
            comments
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status: false,
            msg: 'Cannot view post'
        })
    }

}

const viewPostsUser = async ( req , res ) =>{
    const user_id = parseInt(req.user.user_id)

    const posts = await prisma.post.findMany({
        where: {
            user_id,
        },
        orderBy : [{
            createdAt : 'desc'
        }]
    })

    res.json({
        status: true,
        posts
    })
}

const serializeUser = user=>{
    return {
        _id : user._id,
        email:user.email,
        token : user.accessToken
    }
}

module.exports = {
    userRegister,
    loginUser,
    followUser,
    unfollowUser,
    getProfile,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    commentPost,
    viewPost,
    viewPostsUser
}