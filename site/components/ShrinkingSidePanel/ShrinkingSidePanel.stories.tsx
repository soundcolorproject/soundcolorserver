
import * as React from 'react'
import { select, boolean } from '@storybook/addon-knobs'

import { ShrinkingSidePanel } from './ShrinkingSidePanel'
import { ShrinkingPanelButton } from '../ShrinkingPanelButton'

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
        <ShrinkingPanelButton icon='colors' shrink={shrink} active={activePanel === 'colors'}>
          Color Patterns
        </ShrinkingPanelButton>
        <ShrinkingPanelButton icon='connections' shrink={shrink} active={activePanel === 'connections'}>
          Connections
        </ShrinkingPanelButton>
        <ShrinkingPanelButton icon='tune' shrink={shrink} active={activePanel === 'options'}>
          Options
        </ShrinkingPanelButton>
        <ShrinkingPanelButton icon='music_note' shrink={shrink} active={activePanel === 'sound'}>
          Sound Details
        </ShrinkingPanelButton>
        <ShrinkingPanelButton icon='play_circle' shrink={shrink} active={activePanel === 'actions'}>
          Actions
        </ShrinkingPanelButton>
      </ShrinkingSidePanel>
    </div>
  )
}
