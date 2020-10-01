import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import auth from './../auth/auth-helper'
import {Link, withRouter} from 'react-router-dom'

/**To indicate the current location of the application on the Menu, we will highlight the
link that matches the current location path by changing the color conditionally. */
const isActive = (history, path) => {
    if (history.location.pathname == path)
      return {color: '#ffa726'}
    else
      return {color: '#ffffff'}
  }


/**To implement these navigation bar functionalities, we will use the
HOC withRouter from React Router to get access to the history object's properties. */
const Menu = withRouter(({history}) => (
  
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          MERN Social
        </Typography>
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(history, "/")}>
            <HomeIcon/>
          </IconButton>
        </Link>
{/* The remaining links such as SIGN IN, SIGN UP, MY PROFILE, and SIGN OUT will
show up on the Menu based on whether the user is signed in or not. */}

{/* the links to SIGN UP and SIGN IN should only appear on the menu
when the user is not signed in */}
        {
        !auth.isAuthenticated() && (<span>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")} suppressHydrationWarning={true}>Sign Up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Sign In
            </Button>
          </Link>
        </span>)
      }

{/* the link to MY PROFILE and the SIGN OUT button should only appear on
the menu when the user is signed in, */}
    {
// The MY PROFILE button uses the signed-in user's information to link to the user's
//own profile
        auth.isAuthenticated() && (<span>
            <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button style={isActive(history, "/user/" + auth.isAuthenticated().user._id)} suppressHydrationWarning={true}>My Profile</Button>
            </Link>
{/* SIGN OUT button calls the auth.clearJWT() method when
it's clicked. */}
             <Button color="inherit" onClick={() => {
              auth.clearJWT(() => history.push('/'))
            }}>Sign out</Button>
        </span>)
    }
         </Toolbar>
  </AppBar>
))

export default Menu