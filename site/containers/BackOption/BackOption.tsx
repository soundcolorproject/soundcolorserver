
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { RoutingProp } from '../../state/routingStore'

import { backOption, backButton, routeName } from './backOption.pcss'
import { Icon } from '../../components/Icon'

interface OwnProps {
  name?: string
}

type StateProps = RoutingProp

export type BackOptionPropps = OwnProps & StateProps

export const BackOption = injectAndObserve<StateProps, OwnProps>(
  ({ routing }) => ({ routing }),
  class BackOption extends React.Component<BackOptionPropps> {
    goBack = (ev: React.MouseEvent) => {
      ev.preventDefault()
      this.props.routing.popSubroute()
    }

    render () {
      const { routing, name } = this.props
      return (
        <div className={backOption}>
          <button
            type='button'
            role='button'
            className={backButton}
            onClick={this.goBack}
          >
            <Icon color='var(--black)' name='arrow_back' />
          </button>
          <div className={routeName}>{name || routing.getSubRouteName()}</div>
        </div>
      )
    }
  },
)
