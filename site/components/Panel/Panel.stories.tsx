
import * as React from 'react'
import { select, boolean } from '@storybook/addon-knobs'

import { Panel } from './Panel'

export default {
  title: 'Panel',
}

const style = {
  padding: 10,
  background: '#888',
  color: 'white',
}

function getTransitionSpeed () {
  const name = select('transition speed', ['instant', '0.1s', '0.3s', '0.5s', '1s', '2s'], '0.5s')
  switch (name) {
    case 'instant': return 0
    case '0.1s': return 100
    case '0.3s': return 300
    case '0.5s': return 500
    case '1s': return 1000
    case '2s': return 2000
    default: return 500
  }
}

function getContent () {
  const val = select('content', ['one', 'two', 'three', 'lorem ipsum'], 'one')
  if (val === 'one') {
    return <div className='one' style={{ ...style, height: 100 }}>One</div>
  } else if (val === 'two') {
    return <div className='two' style={{ ...style, height: 200 }}>Two</div>
  } else if (val === 'three') {
    return <div className='three' style={{ ...style, height: 300 }}>Three</div>
  } else {
    return <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
  }
}

export const withDefaultSize = () => (
  <Panel
    back={boolean('back', false)}
    transitionSpeed={getTransitionSpeed()}
  >
    {getContent()}
  </Panel>
)

export const withSetSize = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  }}>
    <Panel
      back={boolean('back', false)}
      transitionSpeed={getTransitionSpeed()}
      style={{ width: 320 }}
    >
      {getContent()}
    </Panel>
  </div>
)
