import express from 'express'
import userCtrl from '../controller/user.controller'
import authCtrl from '../controller/auth.controller'

const router = express.Router()

router.route('/api/users')
    .get(userCtrl.list) //Listing users with GET
    .post(userCtrl.create) //Creating a new user with POST

// route to retrieve image stored in db for each user and also default route for those who dont have
router.route('/api/users/photo/:userId')
  .get(userCtrl.photo, userCtrl.defaultPhoto)
router.route('/api/users/defaultphoto')
  .get(userCtrl.defaultPhoto)

// follow and unfollow routes
router.route('/api/users/follow')
  .put(authCtrl.requireSignin, userCtrl.addFollowing, userCtrl.addFollower)
router.route('/api/users/unfollow')
  .put(authCtrl.requireSignin, userCtrl.removeFollowing, userCtrl.removeFollower)



//new API on the server to query the database and fetch the list of
//users the current user is not following
router.route('/api/users/findpeople/:userId')
  .get(authCtrl.requireSignin, userCtrl.findPeople)


    // user route declarations that need to be protected with authentication and authorization.
router.route('/api/users/:userId')
// --route to read user's information requires only authentication verification
    .get(authCtrl.requireSignin, userCtrl.read) //Fetching a user with GET
    // --route for update and delete requires both authentication and authorization
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update) //Updating a user with PUT
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove) //Deleting a user with DELETE


router.param('userId', userCtrl.userByID)

export default router

