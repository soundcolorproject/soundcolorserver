
import * as React from 'react'
import { RouteComponentProps } from '@reach/router'

import { mainpanel } from './mainPanel.pcss'
import { injectAndObserve } from '../../state/injectAndObserve'
import { RoutingProp } from '../../state/routingStore'

type StateProps = RoutingProp

export interface OwnProps extends RouteComponentProps {
}

export type MainPanelProps = OwnProps & StateProps

export const MainPanel = injectAndObserve<StateProps, OwnProps>(
  ({ routing }) => ({ routing }),
  function MainPanel (props: MainPanelProps) {
    return (<div className={mainpanel}></div>)
  },
)
