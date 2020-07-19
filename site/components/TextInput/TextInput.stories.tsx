
import * as React from 'react'

import { TextInput } from './TextInput'
import { text } from '@storybook/addon-knobs'
import { Icon } from '../Icon'

export default {
  title: 'TextInput',
}

const noop = () => undefined
const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'var(--white)',
  height: '100%',
}

export const plainKnobs = () => (
  <div style={wrapperStyle}>
    <TextInput
      placeholder={text('placeholder', 'I am a placeholder')}
      value={text('value', 'I am a value')}
      onChange={noop}
      style={{ width: 400, maxWidth: '85vw' }}
    />
  </div>
)

export const knobsWithIcon = () => (
  <div style={wrapperStyle}>
    <TextInput
      placeholder={text('placeholder', 'I am a placeholder')}
      value={text('value', 'I am a value')}
      onChange={noop}
      style={{ width: 400, maxWidth: '85vw' }}
    >
      <Icon name='favorite_border' color='var(--black)' />
    </TextInput>
  </div>
)

function StatefulInput () {
  const [value, setValue] = React.useState('')

  return (
    <div style={wrapperStyle}>
      <TextInput
        placeholder={text('placeholder', 'I am a placeholder')}
        value={value}
        onChange={setValue}
        style={{ width: 400, maxWidth: '85vw' }}
      />
    </div>
  )
}

export const stateful = () => (
  <StatefulInput />
)
