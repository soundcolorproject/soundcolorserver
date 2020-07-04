
import * as React from 'react'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from 'site/state/useStores'

import { $lowerName } from './$lowerName.pcss'

export interface $UpperNameProps extends RouteComponentProps {
}

export const $UpperName: React.FunctionComponent<$UpperNameProps> = function $UpperName (_props) {
  const { patterns } = useStores()

  return useObserver(() => (
    <div className={$lowerName} data-testid='$dash-name'>
      Current pattern is {patterns.patternData[patterns.currentPattern].description}
    </div>
  ))
}
