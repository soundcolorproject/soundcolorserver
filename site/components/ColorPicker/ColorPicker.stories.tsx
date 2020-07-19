
import * as React from 'react'
import { text } from '@storybook/addon-knobs'

import { Color } from '../../pcss-functions'

import { ColorPicker } from './ColorPicker'

export default {
  title: 'ColorPicker',
}

const DEFAULT_COLOR = '#baa3fa'
function StatefulPicker () {
  const [color, setColor] = React.useState<Color>(DEFAULT_COLOR)

  return (
    <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <ColorPicker
        value={color}
        onChange={setColor}
      >
        {text('content', 'C')}
      </ColorPicker>
    </div>
  )
}

export const statefulExample = () => {
  return (
    <StatefulPicker />
  )
}
