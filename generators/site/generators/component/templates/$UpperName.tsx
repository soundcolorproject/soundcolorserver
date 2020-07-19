
import * as React from 'react'
import * as classNames from 'classnames'

import { $lowerName } from './$lowerName.pcss'

interface Props {
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

export function $UpperName (props: Props) {
  const {
    className,
    style,
    'data-testid': testid = '$dash-name',
  } = props

  return (
    <div
      className={classNames($lowerName, className)}
      style={style}
      data-testid={testid}
    >
      $UpperName Component Content
    </div>
  )
}
