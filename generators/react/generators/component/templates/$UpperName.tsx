
import * as React from 'react'
import * as classNames from 'classnames'

import { $lowerName } from './$lowerName.pcss'

interface Props {
  className?: string
  style?: React.CSSProperties
}

export function $UpperName (props: Props) {
  const { className, style } = props

  return (
    <div
      className={classNames($lowerName, className)}
      style={style}
      data-testid='$dash-name'
    >
      $UpperName Component Content
    </div>
  )
}
