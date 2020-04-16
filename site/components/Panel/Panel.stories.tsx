
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

export const withText = () => (
  <Panel back={boolean('back', false)}>
    {getContent()}
  </Panel>
)
