import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from '../template'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'

// modules for server side rendering
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import MainRouter from './../client/MainRouter'
import { StaticRouter } from 'react-router-dom'

import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
import theme from './../client/theme'
//end

import devBundle from './devBundle'


const app = express()
//These lines are only meant for development mode and should be
//commented out when building the code for production.
devBundle.compile(app)

/**middleware, along with
the client-side Webpack configuration. Then, it will initiate Webpack to compile and
bundle the client-side code and also enable hot reloading. */

//configure express.js so that it serves static files from the dist folder
const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))


/* ...configure express */
/**body-parser: Request body-parsing middleware to handle the
complexities of parsing streamable request objects so that we can simplify
browser-server communication by exchanging JSON in the request body. */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser()) //Cookie parsing middleware to parse and set cookies in request objects.
app.use(compression()) //Compression middleware that will attempt to compress response bodies for all requests that traverse through the middleware.
app.use(helmet())  //Collection of middleware functions to help secure Express apps by setting various HTTP headers
app.use(cors()) //Middleware to enable cross-origin resource sharing (CORS)


//routes
app.use('/', userRoutes)
app.use('/', authRoutes) //This will make the routes we define in auth.routes.js accessible from the clientside.

app.use((err, req, res, next) => {
    // express-jwt throws an error named UnauthorizedError when a token cannot be validated for some reason
    if(err.name === "UnauthorizedError") {
        res.status(401).json({"error": err.name + ": " + err.message})

    }
    else if (err) {
        res.status(400).json({"error": err.name + ": " + err.message})
        console.log(err)
    }
})

// --getting the template
/**generates some server-side rendered markup and the CSS of the relevant React
component tree, before adding this markup and CSS to the template. */
app.get('*', (req, res) => {
    // 1. Generate CSS styles using Material-UI's ServerStyleSheets
    const sheets = new ServerStyleSheets()
    const context = {}
    const markup = ReactDOMServer.renderToString( //renderToString returns markup containing the relevant view
        sheets.collect(
            <StaticRouter location={req.url} context={context}>
{/* stateles staticRouter is used instead of browserRouter tht is used on client side */}
                <ThemeProvider theme={theme}>
{/* MainRouter is wrapped with material-UL themeProvider to provide styling props needed by main Router child component */}
                    <MainRouter />
                </ThemeProvider>
            </StaticRouter>
        )
    )
    // 2. Use renderToString to generate markup which renders
    // components specific to the route requested
    if (context.url) {
        return res.redirect(303, context.ur)
    }
    const css = sheets.toString()
// 3. Return template with markup and CSS styles in the response
    res.status(200).send(Template({
        markup: markup,
        css: css
    }))
})

export default app