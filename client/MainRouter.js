import React from 'react'
import {Route, Switch } from 'react-router-dom'
import Home from './core/Home'
import Users from './users/Users'
import Signup from './users/Signup'
import Signin from './auth/Signin'
import Profile from './users/Profile'


const MainRouter = () => {
    return (
        <div>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/users" component={Users} />
                <Route path="/signup" component={Signup} />
                <Route path="/signin" component={Signin} />
                <Route path="/user/:userId" component={Profile} />
            </Switch>
        </div>
    )
}

export default MainRouter