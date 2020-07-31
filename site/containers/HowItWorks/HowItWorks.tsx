
import * as React from 'react'
import * as cn from 'classnames'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'

import { howItWorks, hidden, button, list } from './howItWorks.pcss'
import { Button } from '../../components/Button'
import { getDefault } from '../../pcss-functions'

export interface HowItWorksProps extends RouteComponentProps {
  'data-testid'?: string
}

export const HowItWorks: React.FunctionComponent<HowItWorksProps> = function HowItWorks (props: HowItWorksProps) {
  const {
    'data-testid': testid = 'how-it-works',
  } = props
  const { intro } = useStores()
  const [actuallyHide, setActuallyHide] = React.useState(intro.seenHowItWorks)

  React.useEffect(() => {
    if (intro.seenHowItWorks && !actuallyHide) {
      setTimeout(() => setActuallyHide(true), 0.5)
    }
  }, [intro.seenHowItWorks])

  const handleClick = React.useCallback(() => {
    intro.seenHowItWorks = true
  }, [intro])

  return useObserver(() => {
    if (actuallyHide) {
      return null
    }

    return (
      <div className={cn(howItWorks, { [hidden]: intro.seenHowItWorks || !intro.warningAccepted })} data-testid={testid}>
        <h1>How it works:</h1>
        <ol className={list}>
          <li>Start SOVIS</li>
          <li>Allow microphone access if prompted</li>
          <li>Make any noise or sound and watch the light and color react.</li>
          <li>Change color patterns, connections, and options according to your liking.</li>
        </ol>
        <Button color={getDefault('black')} className={button} onClick={handleClick} data-testid={`${testid}-button`}>
          Start SOVIS
        </Button>
      </div>
    )
  })
}

/*
How it works:

1. Start SOVIS
2. Allow microphone access if prompted
3. Make any noise or sound and watch the light and color react.
4. Change color patterns, connections, and options according to your liking.
*/
