import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Person from '@material-ui/icons/Person'
import Divider from '@material-ui/core/Divider'
import DeleteUser from './DeleteUser'
import auth from '../auth/auth-helper'
import {read} from './api-user.js'
import {Redirect, Link} from 'react-router-dom'
import ProfileTabs from '../users/ProfileTabs'
import FollowProfileButton from '../users/FollowProfileButton'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
      maxWidth: 600,
      margin: 'auto',
      padding: theme.spacing(3),
      marginTop: theme.spacing(5)
    }),
    title: {
      marginTop: theme.spacing(3),
      color: theme.palette.protectedTitle
    }
  }))

/**This profile information can be fetched from the server if the user is signed in. To
verify this, the component has to provide the JWT credential to the read fetch call;
otherwise, the user should be redirected to the Sign In view. */



export default function Profile({ match }) {
    const classes = useStyles()
    const [values, setValues] = useState({
      user: {following:[], followers:[]},
      redirectToSignin: false,
      following: false
    })
    // const [, setRedirectToSignin] = useState(false)
    const jwt = auth.isAuthenticated()

/**We also need to get access to the match props passed by the Route component,
which will contain a :userId parameter value. This can be accessed as
match.params.userId. */
    useEffect(() => {
/**This effect uses the match.params.userId value and calls the read user fetch
method. Since this method also requires credentials to authorize the signed-in user,
the JWT is retrieved from sessionStorage using the isAuthenticated method
from auth-helper.js, and passed in the call to read */
        const abortController = new AbortController()
        const signal = abortController.signal
        
/**Once the server responds, either the state is updated with the user information or the
view is redirected to the Sign In view if the current user is not authenticated */
        read({
            userId: match.params.userId
        }, {t: jwt.token}, signal).then((data) => {
            if (data && data.error) {
              setValues({...values, redirectToSignin: true})
            } else {
/**In the Profile component, after the user data is successfully fetched in useEffect,
we will check whether the signed-in user is already following the user in the profile
or not and set the following value to the respective state, as shown in the following
code */
              let following = checkFollow(data)
              setValues({...values, user:data, following: following})
            }
        })
/**We also
add a cleanup function in this effect hook to abort the fetch signal when the
component unmounts. */
        return function cleanup() {
            abortController.abort()
        }
        
    }, [match.params.userId])
/**This effect only needs to rerun when the userId parameter changes in the route, for
example, when the app goes from one profile view to the other. To ensure this effect
reruns when the userId value updates, we will add [match.params.userId] in
the second argument to useEffect. */

////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////check follow method///////////////////////////////////////////////////////////
/**To determine the value to set in following, the checkFollow method will check if
the signed-in user exists in the fetched user's followers list, then return match if
found; otherwise, it will return undefined if a match is not found. */

const checkFollow = (user) => {
  const match = user.followers.some((followers) => {
    return followers._id == jwt.user._id
  })
  return match
}

/**The Profile component will also define the click handler for
FollowProfileButton so that the state of the Profile can be updated when the
follow or unfollow action completes */

const clickFollowButton = (callApi) => {
  callApi({
    userId: jwt.user._id
  }, {
    t: jwt.token
  }, values.user._id).then((data) => {
    if (data.error) {
      setValues({...values, error: data.error})
    }else {
      setValues({...values, user:data, following: !values.following})
    }
  })
}

// use the img element's src attribute to load the photo in the view
const photoUrl = values.user._id
      ? `/api/users/photo/${values.user._id}?${new Date().getTime()}` //time value is added to ensure img reloads in profile view after update of photo
      : '/api/users/defaultphoto'

//If the current user is not authenticated, we set up the conditional redirect to the Sign
//In view.

    if(values.redirectToSignin) {
        return <Redirect to='/signin'/>
    }
//return the profile view if the  user currently signed in is viewing another user's profile

    return (
        <Paper className={classes.root} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          Profile
        </Typography>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={photoUrl} />
    <ListItemText>{
      }</ListItemText>
            </ListItemAvatar>
{/* Edit button and a
DeleteUser component, which will render conditionally based on whether the
current user is viewing their own profile. */}
                <ListItemText primary={values.user.name} secondary={values.user.email}/> {
/**In the Profile view, FollowProfileButton should only be shown when the user
views the profile of other users, */
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == values.user._id 
             ? (<ListItemSecondaryAction>
                <Link to={"/user/edit/" + values.user._id}>
                  <IconButton aria-label="Edit" color="primary">
        {/* The Edit button will route to the EditProfile component */}
                    <Edit/>
                  </IconButton>
                </Link>
        {/* custom DeleteUser component will handle the delete operation with the userId passed to
it as a prop. */}
                            <DeleteUser userId={values.user._id} />
                        </ListItemSecondaryAction>)
          :(<FollowProfileButton following={values.following} onButtonClick={clickFollowButton}/>)
                } 
             </ListItem>
          <Divider/>
{/* to show the description text tht ws added to the about field on the User profile Page */}
            <ListItem> 
              <ListItemText primary={values.user.about}  secondary={"Joined: " + (
              new Date(values.user.created)).toDateString()}/>
          </ListItem>
        </List>
        {/* <ProfileTabs user={values.user} post={posts} removePostUpdate={removePost} /> */}
        <ProfileTabs user={values.user}  />
      </Paper>
    )
}



