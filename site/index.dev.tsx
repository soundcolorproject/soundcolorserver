
import './registerGtag'
import './global-css/index.pcss'
import { registerGlobalHandlers } from './registerGlobalHandlers'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './containers/App/index.dev'

(window as any).logLevel = __LOG_LEVEL__

ReactDOM.render(
  <App />,
  document.getElementById('root'),
)

registerGlobalHandlers()
