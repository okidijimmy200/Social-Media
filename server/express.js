import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import Template from '../template'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'

const app = express()

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

// --getting the template
app.get('/', (req, res) => {
    res.status(200).send(Template())
})

export default app