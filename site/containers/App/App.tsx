
import * as React from 'react'
import { AppRouter } from '../../AppRouter'
import { bootstrap } from '../../bootstrap'
import { logger } from '../../../shared/logger'

class App extends React.Component {
  componentDidMount () {
    bootstrap().catch(err => {
      logger.error('something went wrong while bootstrapping the app:\n', err)
    })
  }
  
  public render () {
    return (
      <AppRouter />
    )
  }
}

export default App
