/**In order to save the JWT credentials that are received from the server on successful
sign-in, we use the authenticate method */

authenticate(jwt, cb); {
/**The authenticate method takes the JWT credentials, jwt, and a callback
function, cb, as arguments */

    if(typeof window !== "undefined")
// It stores the credentials in sessionStorage after ensuring window is defined,
    sessionStorage.setItem('jwt', JSON.stringify(jwt))
// --execute the callback function
    cb()
}


/////////////////////////////////////////////////////////////////
///isAuthenticated//////////////////////////////////////////////

/**we will need to retrieve the stored credentials from sessionStorage to check if
the current user is signed in. */

isAuthenticated(); {
    if (typeof window == "undefined")
//incase no credentails founf in sessionStorage
        return false
    if (sessionStorage.getItem('jwt'))
// Finding credentials in storage will mean a user is signed in,
        return JSON.parse(sessionStorage.getItem('jwt'))
    else 
        return false
}

////////////////////////////////////////////////////////////////
////////////////////Deleting credentials//////////////////////

/**When a user successfully signs out from the application, we want to clear the stored
JWT credentials from sessionStorage by using clearJWT */

clearJWT(cb); {
    if (typeof window !== "undefined")
// reoving JWT  credential from sessionStorage
        sessionStorage.removeItem('jwt')
/** cb() function allows the component initiating the signout functionality to dictate what should happen after a
successful sign-out. */
    cb()
/**The clearJWT method also uses the signout method we defined earlier in apiauth.
js to call the signout API in the backend */
    signout().then((data) => { //using signup is optional since its dependant on whether cookies r used as credential storage
        document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    })
}

