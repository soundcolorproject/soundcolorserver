
import './global-css/index.pcss'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './components/App/index.dev'
import { registerGlobalHandlers } from './registerGlobalHandlers'

(window as any).logLevel = __LOG_LEVEL__

ReactDOM.render(
  <App />,
  document.getElementById('root'),
)

registerGlobalHandlers()
