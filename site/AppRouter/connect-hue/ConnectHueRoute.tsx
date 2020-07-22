
import * as React from 'react'
import { redirectTo, RouteComponentProps, useNavigate } from '@reach/router'
import { useStores } from '../../state/useStores'
import { logger } from '../../../shared/logger'

export interface ConnectHueRouteProps extends RouteComponentProps {
}

export function ConnectHueRoute (_props: ConnectHueRouteProps) {
  const { routing } = useStores()
  const navigate = useNavigate()
  React.useEffect(() => {
    logger.info('heeeeeeeere!')
    routing.panelRoute = 'connections'
    routing.goToSubroute('hueGroupSelector')
    navigate('/sovis').catch()
  }, [])

  return (
    <div></div>
  )
}
