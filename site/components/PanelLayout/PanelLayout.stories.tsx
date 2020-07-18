
import * as React from 'react'
import { select, boolean } from '@storybook/addon-knobs'
import { PanelLayout } from './PanelLayout'

export default {
  title: 'PanelLayout',
}

export const withContent = () => (
  <PanelLayout
    preSpacer={
      <div style={{
        padding: 10,
        color: '#444',
      }}>Foo</div>
    }
    postSpacer={<div style={{
      padding: 10,
      background: '#888',
      color: 'white',
    }}>Bar</div>}
  />
)
