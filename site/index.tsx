
import './global-css/index.pcss'
import { registerGlobalHandlers } from './registerGlobalHandlers'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './containers/App'

ReactDOM.render(
  <App />,
  document.getElementById('root'),
)

registerGlobalHandlers()
