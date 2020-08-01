
import '@simonwep/pickr/dist/themes/nano.min.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'react-hot-loader'

import App from './containers/App/index.dev'
import './global-css/index.pcss'
import * as pcssFunctions from './pcss-functions'
import { registerGlobalHandlers } from './registerGlobalHandlers'
import './registerGtag'
import { registerServiceWorker } from './registerServiceWorker'

registerServiceWorker()

const win = window as any

win._pcssFunctions = pcssFunctions

win.logLevel = __LOG_LEVEL__

ReactDOM.render(
  <App />,
  document.getElementById('root'),
)

registerGlobalHandlers()
