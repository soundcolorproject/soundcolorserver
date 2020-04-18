
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'

import { hueRoot } from './hueRoot.pcss'
import { ApiStatusProp } from '../../state/apiStatusStore'
import { MenuOption, ButtonOption, ClickableMenuOption } from '../../components/MenuOption'
import { logger } from '../../../shared/logger'
import { BackOption } from '../BackOption'
import { RoutingProp } from '../../state/routingStore'
import { OverUnder } from '../../components/OverUnder'

interface OwnProps {
}

type StateProps = ApiStatusProp & RoutingProp

export type HueRootProps = OwnProps & StateProps

export const HueRoot = injectAndObserve<StateProps, OwnProps>(
  ({ apiStatus, routing }) => ({ apiStatus, routing }),
  class HueRoot extends React.Component<HueRootProps> {
    refetchGroups = () => {
      this.props.apiStatus.fetchLightGroups().catch(e => {
        logger.warn('Failed to fetch light groups!', e)
      })
    }

    toggleHueIntegration = () => {
      const { apiStatus } = this.props
      apiStatus.transmitToLightGroup = !apiStatus.transmitToLightGroup
    }

    toGroupSelector = () => this.props.routing.goToSubroute('hueGroupSelector')

    renderContent = () => {
      const { apiStatus, routing } = this.props
      if (!apiStatus.authenticated) {
        return (
          <MenuOption>
            Not logged in!
          </MenuOption>
        )
      }

      if (apiStatus.lightGroupFetchError) {
        return (
          <>
            <MenuOption>
              <OverUnder
                over='Light Group'
                under='Failed to fetch light groups!'
              />
            </MenuOption>
            <ButtonOption icon='refresh' onClick={() => apiStatus.fetchLightGroups()}>
              Retry
            </ButtonOption>
          </>
        )
      }

      if (apiStatus.loadingLightGroups || !apiStatus.lightGroups) {
        return (
          <MenuOption>
            <OverUnder
              over='Light Group'
              under='Finding light groups...'
            />
          </MenuOption>
        )
      }

      if (apiStatus.lightGroups.length < 0) {
        return (
          <MenuOption>
            <OverUnder
              over='Light Group'
              under='No light groups.'
            />
          </MenuOption>
        )
      }

      const lightGroup = apiStatus.lightGroups.find(g => g.id === apiStatus.lightGroupId)
      if (!lightGroup) {
        return (
          <ClickableMenuOption icon='arrow_forward' onClick={this.toGroupSelector}>
            <OverUnder
              over='Light Group'
              under='None Selected'
            />
          </ClickableMenuOption>
        )
      }

      const transmitting = apiStatus.transmitToLightGroup
      return (
        <>
          <ClickableMenuOption icon='arrow_forward' onClick={this.toGroupSelector}>
            <OverUnder
              over='Light Group'
              under={lightGroup.name}
            />
          </ClickableMenuOption>
          <ButtonOption
            icon={transmitting ? 'pause' : 'play'}
            onClick={this.toggleHueIntegration}
          >
            <>
              {
                apiStatus.transmitToLightGroup
                  ? 'Stop '
                  : 'Start '
              }
              Hue Integration
            </>
          </ButtonOption>
        </>
      )
    }

    render () {
      return (
        <div className={hueRoot}>
          <BackOption name='Philips Hue' />
          {this.renderContent()}
        </div>
      )
    }
  },
)
