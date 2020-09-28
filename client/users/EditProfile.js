import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import auth from './../auth/auth-helper'
import {read, update} from './api-user.js'
import {Redirect} from 'react-router-dom'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  }
}))


/**the component will fetch the user's
information with their ID after verifying JWT for auth, and then load the form with
the received user information */

export default function EditProfile({ match }) {
    const classes = useStyles()
    const [values, setValues] = useState({
      name: '',
      about: '',
      photo: '',
      email: '',
      password: '',
      error: '',
      redirectToProfile: false,
      id: ''
    })
    const jwt = auth.isAuthenticated()
  
    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  
      read({
        userId: match.params.userId
      }, {t: jwt.token}, signal).then((data) => {
        if (data && data.error) {
          setValues({...values, error: data.error})
        } else {
          setValues({...values, id: data._id, name: data.name, email: data.email,  about: data.about})
        }
      })
      return function cleanup(){
        abortController.abort()
      }
  
    }, [match.params.userId])

const clickSubmit = () => {
  /**on form submission, we need to initialize FormData and append the values
from the fields that were updated */
    let userData = new FormData()
    values.name && userData.append('name', values.name)
    values.email && userData.append('email', values.email)
    values.password && userData.append('password', values.password)
    values.about && userData.append('about', values.about)
    values.photo && userData.append('photo', values.photo)

    /**After appending all the fields and values to it, userData is sent with the fetch API
call to update the user */
        update({
            userId: match.params.userId
        }, {
            t: jwt.token
        }, userData).then((data) => {
            if (data && data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({...values, 'redirectToProfile': true})
            }
        })
    }
    const handleChange = name => event => {
/**update the input handleChange function so that we can store input
values for both the text fields and the file input */
      const value = name === "photo"
      ? event.target.files[0]
      : event.target.value
      // //userData.set(name, value)
        setValues({...values, [name]: value})
      }
      const photoUrl = values.id
                  ? `/api/users/photo/${values.id}?${new Date().getTime()}`
                  : '/api/users/defaultphoto'
/**Depending on the response from the server, the user will either see an error message
or be redirected to the updated Profile page using the Redirect component */
        if (values.redirectToProfile) {
            return (<Redirect to={'/user/' + values.id} />)
        }

        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Edit Profile
                    </Typography>
  {/* utilize the HTML5 file input type to let the user select an image from their
local files */}
                 <Avatar src={photoUrl} className={classes.bigAvatar}/><br/>
                  <input accept="image/*" className={classes.input} type="file"
                    onChange={handleChange('photo')}
                    style={{display: 'none'}} // display to none to integrate input element with Material-UI
                    id="icon-button-file" />
                    <label htmlFor="icon-button-file">
  {/* When the Button's component prop is set to span, the Button component renders as
a span element inside the label element. */}
                      <Button variant="contained" color="default" component="span">
                        Upload 
                        <FileUpload />
                      </Button>
                    </label>
{/* A click on the Upload span or label is
registered by the file input with the same ID as the label, and as a result, the file select
dialog is opened. Once the user selects a file, we can set it to state in the call
to handleChange(...) and display the name in the view, */}
                  <span className={classes.filename}>
                    {values.photo ? values.photo.name : ''}
                  </span><br/>
{/* the user will see the name of the file they are trying to upload as the profile
photo. */}
                    <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal" /> <br/>
{/* to get description as input from User, we add a multiline TextField */}
                    <TextField id="multiline-flexible" 
                     label="About" 
                     multiline 
                     rows="2" 
                     value={values.about}
                    onChange={handleChange('about')}
                    className={classes.textField}
                    margin="normal"
              /><br/>
                    <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
                    <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
          {
              values.error && (<Typography component="p" color="error">
                  <Icon color="error" className={classes.error}>error</Icon>
              {values.error}
              </Typography>
              )
          }
                </CardContent>
                <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
            </Card>
        )

}



