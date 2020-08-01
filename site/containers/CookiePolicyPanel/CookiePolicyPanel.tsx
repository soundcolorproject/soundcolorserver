
import { RouteComponentProps } from '@reach/router'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { Button } from '../../components/Button'
import { Panel } from '../../components/Panel'
import { PanelDetail } from '../../components/PanelDetail'
import { useStores } from '../../state/useStores'

import { buttons, cookiePolicyPanel } from './cookiePolicyPanel.pcss'

export interface CookiePolicyPanelProps extends RouteComponentProps {
  'data-testid'?: string
}

export const CookiePolicyPanel: React.FunctionComponent<CookiePolicyPanelProps> = function CookiePolicyPanel (props: CookiePolicyPanelProps) {
  const {
    'data-testid': testid = 'cookie-policy-panel',
  } = props
  const { apiStatus, routing } = useStores()
  const [redirecting, setRedirecting] = React.useState(false)

  const acceptCookies = React.useCallback(() => {
    setRedirecting(true)
    apiStatus.setCookiePolicy(true).then(() => {
      window.location.href = '/login'
    }).catch(() => {
      setRedirecting(false)
    })
  }, [apiStatus])

  const goBack = React.useCallback(() => {
    routing.popSubroute()
  }, [routing])

  return useObserver(() => {
    if (redirecting) {
      return (
        <Panel title='Cookie Policy' data-testid={testid}>
          <PanelDetail>Redirecting to Hue login...</PanelDetail>
        </Panel>
      )
    }
    return (
      <Panel title='Cookie Policy' data-testid={testid}>
        <div className={cookiePolicyPanel}>
          <PanelDetail data-testid={`${testid}-desc-1`}>In order to use our Hue functionality, you need to accept the use of cookies.</PanelDetail>
          <PanelDetail data-testid={`${testid}-desc-2`}>We only use your cookie to connect your browser with your hue login, and never for advertising or marketing purposes.</PanelDetail>

          <PanelDetail className={buttons} data-testid={`${testid}-buttons`}>
            <Button
              onClick={goBack}
              data-testid={`${testid}-button-back`}
            >Go Back</Button>
            <Button
              color='#0080FF'
              onClick={acceptCookies}
              data-testid={`${testid}-button-accept`}
            >Accept</Button>
          </PanelDetail>
        </div>
      </Panel>
    )
  })
}
