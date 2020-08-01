
import { action } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs'
import * as React from 'react'

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
    onClick={action('ShrinkingPanelButton clicked')}
  >
    Color Patterns
  </ShrinkingPanelButton>
)

export const longText = () => (
  <ShrinkingPanelButton
    icon={select('icon', iconNames, 'colors')}
    shrink={boolean('shrink', false)}
    active={boolean('active', false)}
    onClick={action('ShrinkingPanelButton clicked')}
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
  </ShrinkingPanelButton>
)

export const customText = () => (
  <ShrinkingPanelButton
    icon={select('icon', iconNames, 'tune')}
    shrink={boolean('shrink', false)}
    active={boolean('active', false)}
    onClick={action('ShrinkingPanelButton clicked')}
  >
    {text('text', 'Options')}
  </ShrinkingPanelButton>
)
