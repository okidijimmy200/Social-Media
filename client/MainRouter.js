import React from 'react'
import {Route, Switch } from 'react-router-dom'
import Home from './core/Home'
import Users from './users/Users'
import Signup from './users/Signup'
import Signin from './auth/Signin'
import Profile from './users/Profile'
import PrivateRoute from './auth/PrivateRoute'


const MainRouter = () => {
    return (
        <div>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/users" component={Users} />
                <Route path="/signup" component={Signup} />
                <Route path="/signin" component={Signin} />
{/* we will use a PrivateRoute, which
will restrict the component from loading at all if the user is not signed in. */}
                <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
                <Route path="/user/:userId" component={Profile} />
            </Switch>
        </div>
    )
}

export default MainRouter