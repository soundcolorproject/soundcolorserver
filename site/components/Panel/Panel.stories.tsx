
import * as React from 'react'
import { text, boolean, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import { Panel } from './Panel'
import { PanelButton } from '../PanelButton'

export default {
  title: 'Panel',
}

const buttonTexts = [
  'This button should have ellipses due to it being very long text and when the panel is contained (or the window small enough), it is not wide enough to show it all',
  'This is a panel button',
  'So is this',
  'And another',
  'Just making enough',
  'That it will require',
  'The ability to scroll',
  'Does it work?',
]

export const example = () => {
  const contained = boolean('contained', false)
  const title = text('title', 'My Panel')
  const buttonCount = select('button count', [1, 2, 3, 4, 5, 6, 7, 8], 3)
  const button = boolean('title button?', false)

  const buttons = buttonTexts.slice(0, buttonCount).map((text, i) => (
    <PanelButton key={i}>{text}</PanelButton>
  ))

  const content = (
    <Panel title={title} button={
      button
        ? {
          text: text('button text', 'I am a button'),
          onClick: action('panel title button clicked'),
          hoverColor: text('button hover color', '#fab'),
        }
        : undefined
    }>
      {buttons}
    </Panel>
  )

  if (contained) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 272, height: 288 }}>
          {content}
        </div>
      </div>
    )
  } else {
    return content
  }
}
