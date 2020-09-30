import express from 'express'
import userCtrl from '../controller/user.controller'
import authCtrl from '../controller/auth.controller'
import postCtrl from '../controller/post.controller'

const router = express.Router()

/**API to create the post in the database */

// api route for creating new post
router.route('/api/posts/new/:userId')
    .post(authCtrl.requireSignin, postCtrl.create)

    /**To retrieve the uploaded photo by the user making the post */
router.route('/api/posts/photo/:postId')
    .get(postCtrl.photo)

    /**To retrieve posts that have been shared by a specific user, we need to add a route
endpoint that will receive the request for these posts and respond accordingly to the
requesting client- side. */
router.route('/api/posts/by/:userId')
    .get(authCtrl.requireSignin, postCtrl.listByUser)

 /**We are using the :userID parameter in this route to specify the currently signed-in
user. */
router.route('/api/posts/feed/:userId')
    .get(authCtrl.requireSignin, postCtrl.listNewsFeed)

router.route('/api/posts/like')
    .put(authCtrl.requireSignin, postCtrl.like)

router.route('/api/posts/unlike')
    .put(authCtrl.requireSignin, postCtrl.unlike)

router.route('/api/posts/comment')
    .put(authCtrl.requireSignin, postCtrl.comment)

router.route('/api/posts/uncomment')
    .put(authCtrl.requireSignin, postCtrl.uncomment)

// delete post API to delete post from database
router.route('/api/posts/:postId')
    .delete(authCtrl.requireSignin, postCtrl.isPoster, postCtrl.remove)


/**append :userID paramenter to the request object that is
accessed in the listNewsFeed post controller method. */
router.param('userId', userCtrl.userByID)


/**Since the photo route uses the :postID parameter, we will set up a postByID
controller method to fetch a specific post by its ID before returning it to the photo
request, add the param call to post.routes.js, */
router.param('postId', postCtrl.postByID)

export default router