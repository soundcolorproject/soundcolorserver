
import * as React from 'react'
import { select, text, boolean } from '@storybook/addon-knobs'
import { iconNames } from '../Icon'

import { ShrinkingPanelButton } from './ShrinkingPanelButton'

export default {
  title: 'ShrinkingPanelButton',
}

export const example = () => (
  <ShrinkingPanelButton
    icon={select('icon', iconNames, 'colors')}
    shrink={boolean('shrink', false)}
    active={boolean('active', false)}
  >
    Color Patterns
  </ShrinkingPanelButton>
)

export const longText = () => (
  <ShrinkingPanelButton
    icon={select('icon', iconNames, 'colors')}
    shrink={boolean('shrink', false)}
    active={boolean('active', false)}
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
  </ShrinkingPanelButton>
)

export const customText = () => (
  <ShrinkingPanelButton
    icon={select('icon', iconNames, 'tune')}
    shrink={boolean('shrink', false)}
    active={boolean('active', false)}
  >
    {text('text', 'Options')}
  </ShrinkingPanelButton>
)
