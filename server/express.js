import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

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


export default app