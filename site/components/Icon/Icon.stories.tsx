
import * as React from 'react'
import { select, boolean } from '@storybook/addon-knobs'

import { Icon } from './Icon'
import { iconNames, iconSizeNames } from './iconOptions'

export default {
  title: 'Icon',
}

export const specificIcon = () => (
  <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ borderColor: boolean('show border', false) ? 'var(--white)' : 'transparent', borderWidth: 2, borderStyle: 'solid', lineHeight: 0 }}>
      <Icon color='var(--white)' name={select('icon', iconNames, 'favorite_border')} size={select('size', iconSizeNames, 'med')} />
    </div>
  </div>
)
