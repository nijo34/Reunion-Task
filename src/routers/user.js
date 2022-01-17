const express = require('express')
const router = new express.Router()

const auth = require('../middlewares/auth')

const {
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
} = require('../controllers/user')

router.post(
    '/api/authenticate',
    userRegister
)

router.post(
    '/api/login-user',
    auth,
    loginUser
)

router.post(
    '/api/follow/:id',
    auth,
    followUser
)

router.post(
    '/api/unfollow/:id',
    auth,
    unfollowUser
)

router.get(
    '/api/user',
    auth,
    getProfile
)

router.post(
    '/api/post',
    auth,
    createPost
)

router.delete(
    '/api/post/:id',
    auth,
    deletePost
)

router.post(
    '/api/like/:id',
    auth,
    likePost)

router.post(
    '/api/unlike/:id',
    auth,
    unlikePost
)

router.post(
    '/api/comment/:id',
    auth,
    commentPost
)

router.get(
    '/api/post/:id',
    auth,
    viewPost
)

router.get(
    '/api/all_posts',
    auth,
    viewPostsUser
)


module.exports = router