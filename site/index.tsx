
import './global-css/index.pcss'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './components/App'
import { registerGlobalHandlers } from './registerGlobalHandlers'

ReactDOM.render(
  <App />,
  document.getElementById('root'),
)

registerGlobalHandlers()
