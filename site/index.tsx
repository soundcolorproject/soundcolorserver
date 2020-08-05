
import '@simonwep/pickr/dist/themes/nano.min.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './containers/App'
import './global-css/index.pcss'
import { registerGlobalHandlers } from './registerGlobalHandlers'
import './registerGtag'
import { registerServiceWorker } from './registerServiceWorker'

registerServiceWorker()

ReactDOM.render(
  <App />,
  document.getElementById('root'),
)

registerGlobalHandlers()
