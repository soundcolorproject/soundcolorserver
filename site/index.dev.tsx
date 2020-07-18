
import './registerGtag'
import { registerServiceWorker } from './registerServiceWorker'
registerServiceWorker()

import '@simonwep/pickr/dist/themes/nano.min.css'
import './global-css/index.pcss'
import { registerGlobalHandlers } from './registerGlobalHandlers'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as pcssFunctions from './pcss-functions'
(window as any)._pcssFunctions = pcssFunctions

import App from './containers/App/index.dev'

(window as any).logLevel = __LOG_LEVEL__

ReactDOM.render(
  <App />,
  document.getElementById('root'),
)

registerGlobalHandlers()
