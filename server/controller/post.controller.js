import Post from '../models/post.model'
import errorHandler from '../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import { follow } from '../../client/users/api-user'


const create = (req, res, next) => {
/**The create method will use the formidable module to access the fields and the image file */
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async(err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        let post = new Post(fields)
        post.postedBy = req.profile
/**the photo that's uploaded with a new post will be
stored in the Post document in binary format. */
        if (files.photo){
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }
        try {
            let result = await post.save()
            res.json(result)
        } catch(err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}
/**postByID will be similar to the userByID method, and it will attach the post
retrieved from the database to the request object so that it can be accessed by the next
method. */
const postByID = async (req, res,next, id) => {
    try {
/**The attached post data in this implementation will also contain the ID and name of
the postedBy user reference since we are invoking populate(). */
        let post = await Post.findById(id).populate('postedBy', '_id name').exec()
        if (!post)
            return res.status('400').json({
                error: "Post not found"
            })
            req.post = post
            next()
    } catch(err) {
        return res.status('400').json({
            error: "Could not retrieve use post"
        })
    }
}

/**The listByUser controller method in post.controller.js will query the Post
collection to find posts that have a matching reference in the postedBy field to the
user specified in the userId param in the route. */
const listByUser = async(req, res) => {
    try{
        let posts = await Post.find({postedBy: req.profile._id})
                              .populate('comments.postedBy', '_id name')
                              .populate('postedBy', '_id name')
                              .sort('-created')
                              .exec()
        res.json(posts)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/**The listNewsFeed controller method in post.controller.js will query the Post
collection in the database to get the matching posts */
const listNewsFeed = async (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id)
/**In the query to the Post collection, we find all the posts that have postedBy user
references that match the current user's followings and the current user. The posts
that are returned will be sorted by the created timestamp, */
    try {
        let posts = await Post.find({postedBy: { $in : req.profile.following}})
                              .populate('comments.postedBy', '_id name')
                              .populate('postedBy', '_id name')
                              .sort('-created')
                              .exec()
        res.json(posts)

    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async (req, res) => {
    let post = req.post
    try {
        let deletedPost = await post.remove()
        res.json(deletedPost)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/**The photo controller will return the photo data stored in MongoDB as an image file */
const photo = (req, res, next) => {
    res.set("Content-Type", res.post.photo.contentType)
    return res.send(req.post.photo.data)
}

const like = async(req, res) => {
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
        res.json(result)
    }catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const unlike = async (req, res) => {
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
        res.json(result)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const comment = async (req, res) => {
    let comment = req.body.comment
    comment.postedBy = req.body.userId

    try {
        let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comments}}, {new: true})
                               .populate('comments.postBy', '_id name')
                               .populate('postedBy', '_id name')
                               .exec()
        res.json(result)
    }catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const uncomment = async (req, res) => {
    let comment = req.body.comment
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment._id}}}, {new: true})
                               .populate('comments.postedBy', '_id name')
                               .populate('postedBy', '_id name')
                               .exec()
        res.json(result)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
    if(!isPoster){
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

export default {
    listByUser,
    listNewsFeed,
    create,
    postByID,
    remove,
    photo,
    like,
    unlike,
    comment,
    uncomment,
    isPoster
  }