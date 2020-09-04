import express from 'express'
import userCtrl from '../controller/user.controller'

const router = express.Router()

router.route('/api/users')
    .get(userCtrl.list) //Listing users with GET
    .post(userCtrl.create) //Creating a new user with POST

router.route('/api/users/:userId')
    .get(userCtrl.read) //Fetching a user with GET
    .put(userCtrl.update) //Updating a user with PUT
    .delete(userCtrl.remove) //Deleting a user with DELETE

router.param('userId', userCtrl.userByID)

export default router