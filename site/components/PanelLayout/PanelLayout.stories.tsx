
import * as React from 'react'
import { select, boolean } from '@storybook/addon-knobs'
import { PanelLayout } from './PanelLayout'

export default {
  title: 'PanelLayout',
}

const style = {
  padding: 10,
  background: '#888',
  color: 'white',
}

function getContent () {
  const val = select('content', ['one', 'two', 'three'], 'one')
  if (val === 'one') {
    return <div className='one' style={{ ...style, height: 100 }}>One</div>
  } else if (val === 'two') {
    return <div className='two' style={{ ...style, height: 200 }}>Two</div>
  } else {
    return <div className='three' style={{ ...style, height: 300 }}>Three</div>
  }
}

export const withContent = () => (
  <PanelLayout
    preSpacer={
      <div style={{
        padding: 10,
        color: '#444',
      }}>Foo</div>
    }
    postSpacer={getContent()}
    back={boolean('back', false)}
  />
)
