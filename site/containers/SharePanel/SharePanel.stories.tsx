
import * as React from 'react'
import { boolean } from '@storybook/addon-knobs'

import { SharePanel } from './SharePanel'

export default {
  title: 'SharePanel',
}

export const example = () => (
  <SharePanel show={boolean('show', true)} />
)
