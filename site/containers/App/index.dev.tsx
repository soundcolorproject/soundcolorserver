
import { hot, setConfig } from 'react-hot-loader'

import OrigApp from './App'

setConfig({
  logLevel: 'warn',
})

export default hot(module)(OrigApp)
