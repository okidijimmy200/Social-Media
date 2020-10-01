import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'

// The default photo is retrieved and sent from the server's file system
import profileImage from './../../client/assets/images/profile-pic.png'
// import { exec } from 'child_process'

/**--errorHandler helper to respond to route
requests with meaningful messages when a Mongoose error occurs */
/**--lodash module is used when updating an existing user with changed values.  */

//When the Express app gets a POST request at '/api/users', it calls the create
// function we defined in the controller.

const create = async (req, res) => {
    /**new user with the user JSON object that's received in the POST
request from the frontend within req.body. */
    const user = new User(req.body)

    try {
        await user.save()
        return res.status(200).json({
          message: "Successfully signed up!"
        })
      } catch (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
}

/**The list controller function finds all the users from the database, populates only the
name, email, created, and updated fields in the resulting user list, and then returns
this list of users as JSON objects in an array to the requesting client. */
const list = async (req, res) => {
    try {
      let users = await User.find().select('name email updated created')
      res.json(users)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }

const userByID = async (req, res, next, id) => {
    try {
        /**we update the userByID controler to retrieve these details so tht it populates the returned user object */
/**We use the Mongoose populate method to specify that the user object that's
returned from the query should contain the name and ID of the users referenced in
the following and followers lists. */
        let user = await User.findById(id).populate('following', '_id name')
        .populate('followers', '_id name')
        .exec()
        if (!user)
        return res.status('400').json({
            error: "User not found"
        })
/**If a matching user is found in the database, the user object is appended to the request
object in the profile key */
    req.profile = user
    next()
    } catch (err) {
    return res.status('400').json({
        error: "Could not retrieve user"
        })
    }
}

/**The read function retrieves the user details from req.profile and removes
sensitive information, such as the hashed_password and salt values, before
sending the user object in the response to the requesting client */
const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
  }

const update = (req, res) => {
    // formidable allows us read the server and give us access to the fieds and file
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Photo could not be uploaded"
        })
      }
      let user = req.profile
      user = extend(user, fields)
      user.updated = Date.now()
      if(files.photo){
        user.photo.data = fs.readFileSync(files.photo.path)
        user.photo.contentType = files.photo.type
        }
    try {
    // This will store the uploaded file as data in the database
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
    })
}

/**The remove function retrieves the user from req.profile and uses the remove()
query to delete the user from the database */
const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

 //search for photo, if found send the response to the request at the photo route otherwise
//  call next() to return default photo
const photo = (req, res, next) => {
    if(req.profile.photo.data){
      res.set("Content-Type", req.profile.photo.contentType)
      return res.send(req.profile.photo.data)
    }
    next()
  }
  

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd()+profileImage)
  }

/**The addFollowing controller method in the user controller will update the
following array for the current user by pushing the followed user's reference into
the array */

const addFollowing = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}})
        //if successful update of following array, move to next to addfollower method
// is executed to add the current user's reference to the followed user's followers array
        next()
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/**is executed to add the current user's reference to the
followed user's followers array */

const addFollower = async (req, res) => {
    try {
        let result = await User.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new: true})
                                .populate('following', '_id name')
                                .populate('followers', '_id name')
                                exec()
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

//for removefollower and removefollowing update the respiective following and followers arrat by removing the user references with $pull instead of $push
const removeFollowing = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}})
        next()
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const removeFollower = async (req, res) => {
    try {
        let result = await User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}},{new: true} )
                                .populate('following', '_id name')
                                .populate('followers', '_id name')
                                .exec()
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/**In the findPeople controller method, we will query the User collection in the
database to find the users that are not in the current user's following list. */
const findPeople = async (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id)
    try {
        let users = await User.find({ _id: { $nin : following}}).select('name')
        res.json(users)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default { 
    create, 
    userByID, 
    read, 
    list, 
    remove, 
    update, 
    photo, 
    defaultPhoto,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople

}

