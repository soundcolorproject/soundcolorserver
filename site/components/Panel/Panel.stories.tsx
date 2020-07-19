
import * as React from 'react'

import { Panel } from './Panel'
import { text } from '@storybook/addon-knobs'
import { PanelButton } from '../PanelButton'

export default {
  title: 'Panel',
}

export const uncontained = () => (
  <Panel title={text('title', 'My Panel')}>
    <PanelButton>This is a panel button</PanelButton>
    <PanelButton>So is this</PanelButton>
  </Panel>
)
export const contained = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ width: 272, height: 288 }}>
      <Panel title={text('title', 'My Panel')}>
        <PanelButton>This is a panel button</PanelButton>
        <PanelButton>So is this</PanelButton>
        <PanelButton>And another</PanelButton>
        <PanelButton>Just making enough</PanelButton>
        <PanelButton>That it will require</PanelButton>
        <PanelButton>The ability to scroll</PanelButton>
        <PanelButton>Does it work?</PanelButton>
        <PanelButton>This one should also have ellipses due to it being a very long button name</PanelButton>
      </Panel>
    </div>
  </div>
)
