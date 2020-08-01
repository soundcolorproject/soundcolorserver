
import { boolean, select, text } from '@storybook/addon-knobs'
import * as React from 'react'

import { Icon } from './Icon'
import { iconNames, iconSizeNames } from './iconOptions'

export default {
  title: 'Icon',
}

export const specificIcon = () => {
  const icon = select('icon', iconNames, 'favorite_border')
  const color = text('color', 'var(--white)')
  const size = select('size', iconSizeNames, 'med')
  const background = text('background', 'var(--black)')
  const showBorder = boolean('show border', false)
  const borderColor = text('border color', 'var(--grey-50)')

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background }}>
      <div style={{ borderColor: showBorder ? borderColor : 'transparent', borderWidth: 1, borderStyle: 'solid', lineHeight: 0 }}>
        <Icon color={color} name={icon} size={size} />
      </div>
    </div>
  )
}
