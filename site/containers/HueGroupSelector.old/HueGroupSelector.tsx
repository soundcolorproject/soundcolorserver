
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { RoutingProp } from '../../state/routingStore'
import { ApiStatusProp } from '../../state/apiStatusStore'

import { hueGroupSelector } from './hueGroupSelector.pcss'
import { BackOption } from '../BackOption'
import { MenuOption, ClickableMenuOption } from '../../components/MenuOption'

interface OwnProps {
}

type StateProps = ApiStatusProp & RoutingProp

export type HueGroupSelectorProps = OwnProps & StateProps

export const HueGroupSelector = injectAndObserve<StateProps, OwnProps>(
  ({ apiStatus, routing }) => ({ apiStatus, routing }),
  class HueGroupSelector extends React.Component<HueGroupSelectorProps> {
    onClick = (lightGroupId: number | undefined) => () => {
      const { apiStatus, routing } = this.props
      apiStatus.lightGroupId = lightGroupId
      routing.popSubrouteToRoot()
    }

    renderContent = () => {
      const { apiStatus } = this.props

      if (apiStatus.lightGroupFetchError) {
        return (
          <MenuOption>
            Failed to fetch light groups!
          </MenuOption>
        )
      }

      if (apiStatus.loadingLightGroups || !apiStatus.lightGroups) {
        return (
          <MenuOption>
            Finding light groups...
          </MenuOption>
        )
      }

      if (apiStatus.lightGroups.length < 1) {
        return (
          <MenuOption>
            No light groups found
          </MenuOption>
        )
      }

      return (
        <>
          {
            apiStatus.lightGroups.map(group => (
              <ClickableMenuOption key={group.id} onClick={this.onClick(group.id)}>
                {group.name}
              </ClickableMenuOption>
            ))
          }
        </>
      )
    }

    render () {

      return (
        <div className={hueGroupSelector}>
          <BackOption name='Light Group' />
          {this.renderContent()}
        </div>
      )
    }
  },
)
