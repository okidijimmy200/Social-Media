import config from '../config/config'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config.client'

const compile = (app) => {
    if(config.env === "development"){
        const compiler = webpack(webpackConfig)
        /**In this method, the Webpack middleware uses the values set
in webpack.config.client.js, and we enable hot reloading from the server-side
using Webpack Hot Middleware */
        const middleware = webpackMiddleware(compiler, {
            publicPath: webpackConfig.output.publicPath
        })
        app.use(middleware)
        app.use(webpackHotiddleware(compiler))
    }
}

export default {
    compile
}
