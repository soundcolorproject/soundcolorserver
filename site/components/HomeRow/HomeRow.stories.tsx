
import * as React from 'react'
import { select } from '@storybook/addon-knobs'

import { HomeRow } from './HomeRow'

export default {
  title: 'HomeRow',
}

interface HomeRowState {
  selected: 'info' | 'settings' | 'home' | 'filters' | 'palette'
}

class StatefulHomeRow extends React.Component<{}, HomeRowState> {
  state: HomeRowState = {
    selected: 'info',
  }

  setSelected = (selected: HomeRowState['selected']) => {
    this.setState({ selected })
  }

  render () {
    return (
      <HomeRow
        selected={this.state.selected}
        onChange={this.setSelected}
        buttons={{
          info: 'info',
          settings: 'settings',
          home: 'home',
          filters: 'tune',
          palette: 'palette',
        }}
      />
    )
  }
}

export const stateful = () => (
  <StatefulHomeRow />
)
