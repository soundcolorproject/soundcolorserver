
import { action } from '@storybook/addon-actions'
import { boolean, select } from '@storybook/addon-knobs'
import * as React from 'react'

import { ShrinkingPanelButton } from '../ShrinkingPanelButton'

import { ShrinkingSidePanel } from './ShrinkingSidePanel'

export default {
  title: 'ShrinkingSidePanel',
}

export const example = () => (
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
    <ShrinkingSidePanel shrink={boolean('shrink', false)}>
      ShrinkingSidePanel Component Content
    </ShrinkingSidePanel>
  </div>
)

type PanelName = 'none' | 'colors' | 'connections' | 'options' | 'sound' | 'actions'
const panels: PanelName[] = ['none', 'colors', 'connections', 'options', 'sound', 'actions']
export const withShinkingButtons = () => {
  const shrink = boolean('shrink', false)
  const activePanel = select('activePanel', panels, 'none')
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <ShrinkingSidePanel shrink={shrink}>
        <ShrinkingPanelButton
          icon='colors'
          shrink={shrink}
          active={activePanel === 'colors'}
          onClick={action('colors clicked')}
        >
          Color Patterns
        </ShrinkingPanelButton>
        <ShrinkingPanelButton
          icon='connections'
          shrink={shrink}
          active={activePanel === 'connections'}
          onClick={action('connections clicked')}
        >
          Connections
        </ShrinkingPanelButton>
        <ShrinkingPanelButton
          icon='tune'
          shrink={shrink}
          active={activePanel === 'options'}
          onClick={action('options clicked')}
        >
          Options
        </ShrinkingPanelButton>
        <ShrinkingPanelButton
          icon='music_note'
          shrink={shrink}
          active={activePanel === 'sound'}
          onClick={action('sound clicked')}
        >
          Sound Details
        </ShrinkingPanelButton>
        <ShrinkingPanelButton
          icon='play_circle'
          shrink={shrink}
          active={activePanel === 'actions'}
          onClick={action('actions clicked')}
        >
          Actions
        </ShrinkingPanelButton>
      </ShrinkingSidePanel>
    </div>
  )
}
