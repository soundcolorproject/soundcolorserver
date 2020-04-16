
import * as React from 'react'
import * as cn from 'classnames'

import { homeRow, homeRowButton, selected } from './homeRow.pcss'
import { IconName, Icon } from '../Icon'

export interface HomeRowButtons {
  [key: string]: IconName
}

export interface HomeRowProps<T extends HomeRowButtons> {
  buttons: T
  onChange: (selected: keyof T) => void
  selected: keyof T
}

export function HomeRow<T extends HomeRowButtons> (props: HomeRowProps<T>) {
  const { buttons, selected: selectedId, onChange } = props
  const ids = Object.keys(buttons) as (keyof T)[]
  return (
    <div id={homeRow}>
      {
        ids.map(id => {
          const isSelected = id === selectedId
          const onClick = (ev: React.MouseEvent) => {
            ev.preventDefault()
            onChange(id)
          }
          return (
            <button className={cn({ [homeRowButton]: true, [selected]: isSelected })} onClick={onClick}>
              <Icon
                name={buttons[id]}
              />
            </button>
          )
        })
      }
    </div>
  )
}
