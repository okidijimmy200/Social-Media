import React from 'react'
import {render} from 'react-dom'
import App from './App'

/**In client/main.js, we import the root or top-level React component that
will contain the whole frontend and render it to the div element with the 'root' ID
specified in the HTML document in template.js. */
render(<App/>, document.getElementById('root'))