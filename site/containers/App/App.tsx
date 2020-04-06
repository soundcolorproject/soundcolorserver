
import * as React from 'react'
import { MobxProvider } from '../../state/MobxProvider'
import { AppRouter } from '../../AppRouter'

class App extends React.Component {
  public render () {
    return (
      <MobxProvider>
        <AppRouter />
      </MobxProvider>
    )
  }
}

export default App
