
import * as React from 'react'
import { logger } from '../../../shared/logger'
import { MobxProvider } from '../../state/MobxProvider'
import { Root } from './Roots'

class App extends React.Component {
  public render () {
    return (
      <MobxProvider>
        <Root />
      </MobxProvider>
    )
  }
}

export default App
