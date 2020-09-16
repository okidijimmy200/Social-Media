import React from 'react'
import MainRouter from './MainRouter'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'
import { hot } from 'react-hot-loader'

const App = () => {

/**Once the code that's been rendered on the server-side reaches the browser and the
frontend script takes over, we need to remove the server-side injected CSS when the
root React component mounts, using the useEffect hook. */
//this gives back full control of how the react-app renders to the client-side
    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
          jssStyles.parentNode.removeChild(jssStyles)
        }
      }, [])
    return (
        // BrowserRouter, which enables frontend routing with React Router
        <BrowserRouter>
{/* custom theme variables passed as a prop to themeProvider */}
            <ThemeProvider theme={theme}> 
    {/* When defining this root component in App.js, we wrap the MainRouter component
    with ThemeProvider, which gives it access to the Material-UI theme, */}
                <MainRouter />
            </ThemeProvider>
        </BrowserRouter>
    )
}

// uses the higherorder component (HOC) hot module from react-hot-loader to mark the root
// component as hot. this is to enable live reloading of our components
export default hot(module)(App)
