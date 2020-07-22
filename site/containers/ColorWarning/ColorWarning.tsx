
import * as React from 'react'
import * as cn from 'classnames'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'

import { colorWarning, hidden, button } from './colorWarning.pcss'
import { Button } from '../../components/Button'

export interface ColorWarningProps extends RouteComponentProps {
  'data-testid'?: string
}

export const ColorWarning: React.FunctionComponent<ColorWarningProps> = function ColorWarning (props: ColorWarningProps) {
  const {
    'data-testid': testid = 'color-warning',
  } = props
  const { intro } = useStores()
  const [actuallyHide, setActuallyHide] = React.useState(intro.warningAccepted)

  React.useEffect(() => {
    if (intro.warningAccepted && !actuallyHide) {
      setTimeout(() => setActuallyHide(true), 0.5)
    }
  }, [intro.warningAccepted])

  const handleClick = React.useCallback(() => {
    intro.warningAccepted = true
  }, [intro])

  return useObserver(() => {
    if (actuallyHide) {
      return null
    }

    return (
      <div className={cn(colorWarning, { [hidden]: intro.warningAccepted })} data-testid={testid}>
        <h1>Warning:</h1>
        <p>
          SOVIS displays varying degrees of flashing lights and color, and may potentially trigger seizures for people with photosensitive epilepsy.
        </p>
        <p>
          Viewer discretion is advised.
        </p>
        <Button color='#ffffff' className={button} onClick={handleClick}>
          Proceed
        </Button>
      </div>
    )
  })
}
