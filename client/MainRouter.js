// import React from 'react'
// import {Route, Switch } from 'react-router-dom'
// import Home from './core/Home'
// import Users from './users/Users'
// import Signup from './users/Signup'
// import Signin from './auth/Signin'
// import Profile from './users/Profile'
// import EditProfile from './users/EditProfile'
// import PrivateRoute from './auth/PrivateRoute'
// import Menu from './core/Menu'


// const MainRouter = () => {
//     return (
//         <div>
// {/* add Menu route before switch route to make it apppear on all pages */}
//             <Menu />
//             <Switch>
//                 <Route exact path="/" component={Home} />
//                 <Route path="/users" component={Users} />
//                 <Route path="/signup" component={Signup} />
//                 <Route path="/signin" component={Signin} />
// {/* we will use a PrivateRoute, which
// will restrict the component from loading at all if the user is not signed in. */}
//                 <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
//                 <Route path="/user/:userId" component={Profile} />
//             </Switch>
//         </div>
//     )
// }

// export default MainRouter

import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Signup from './users/Signup'
import Users from './users/Users'
import Signin from './auth/Signin'
import EditProfile from './users/EditProfile'
import Profile from './users/Profile'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'

const MainRouter = () => {
    return (
    <div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signin" component={Signin}/>
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <Route path="/user/:userId" component={Profile}/>
      </Switch>
    </div>
    )
}

export default MainRouter
