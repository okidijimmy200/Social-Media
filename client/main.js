import React from 'react'
import {hydrate, render} from 'react-dom'
import App from './App'

/**In client/main.js, we import the root or top-level React component that
will contain the whole frontend and render it to the div element with the 'root' ID
specified in the HTML document in template.js. */
// render(<App/>, document.getElementById('root'))

//we use hydrate to enable rendering from the serverside

hydrate(<App />, document.getElementById('root'))

/**NB:
 * The hydrate function hydrates a container that already has HTML content rendered
by ReactDOMServer. This means the server-rendered markup is preserved and only
event handlers are attached when React takes over in the browser, allowing the initial
load performance to be better.
 */