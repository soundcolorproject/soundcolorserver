
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { ApiStatusProp } from '../../state/apiStatusStore'
import { MediaProp } from '../../state/mediaStore'
import { logger } from '../../../shared/logger'
import { ClickableMenuOption, MenuOption, LinkMenuOption } from '../../components/MenuOption'

import { settings, overUnder, over, under } from './settings.pcss'
import { RoutingProp } from '../../state/routingStore'

interface OwnProps {
}

type StateProps =
  & ApiStatusProp
  & MediaProp
  & RoutingProp

export type SettingsProps = OwnProps & StateProps

export const Settings = injectAndObserve<StateProps, OwnProps>(
  ({ apiStatus, media, routing }) => ({ apiStatus, media, routing }),
  class Settings extends React.Component<SettingsProps> {
    renderDeviceOption = () => {
      const { media: { possibleDevices, currentDeviceId }, routing } = this.props
      if (possibleDevices.length < 1) {
        return (
          <MenuOption>
            <div className={overUnder}>
              <div className={over}>Audio Source</div>
              <div className={under}>
                Looking for devices...
              </div>
            </div>
          </MenuOption>
        )
      }

      const currentDevice = possibleDevices.find(d => d.deviceId === currentDeviceId)

      return (
        <ClickableMenuOption
          icon='arrow_forward'
          onClick={() => routing.goToSubroute('audioSource')}
        >
          <div className={overUnder}>
            <div className={over}>Audio Source</div>
            <div className={under}>
              {currentDevice?.label || 'Select a source'}
            </div>
          </div>
        </ClickableMenuOption>
      )
    }

    renderHueOption = () => {
      const { apiStatus } = this.props
      const {
        authenticated,
        loadingLightGroups,
        lightGroupFetchError,
        lightGroups,
        lightGroupId,
      } = apiStatus

      if (!authenticated) {
        return (
          <LinkMenuOption icon='launch' href='/login'>
            <div className={overUnder}>
              <div className={over}>Philips Hue</div>
              <div className={under}>
                Log in
              </div>
            </div>
          </LinkMenuOption>
        )
      }

      if (loadingLightGroups) {
        return (
          <MenuOption>
            <div className={overUnder}>
              <div className={over}>Philips Hue</div>
              <div className={under}>
                Finding light groups...
              </div>
            </div>
          </MenuOption>
        )
      }

      if (lightGroupFetchError || !lightGroups) {
        return (
          <MenuOption>
            <div className={overUnder}>
              <div className={over}>Philips Hue</div>
              <div className={under}>
                Failed to fetch lights!
              </div>
            </div>
          </MenuOption>
        )
      }

      if (lightGroups.length < 1) {
        return (
          <MenuOption>
            <div className={overUnder}>
              <div className={over}>Philips Hue</div>
              <div className={under}>
                No light groups found!
              </div>
            </div>
          </MenuOption>
        )
      }
      const lightGroup = lightGroups.find(g => g.id === lightGroupId)
      return (
        <ClickableMenuOption
          icon='arrow_forward'
          onClick={() => logger.log('hue')}
        >
          <div className={overUnder}>
            <div className={over}>Philips Hue</div>
            <div className={under}>
              {
                lightGroup
                  ? `${lightGroup.name} -- ${lightGroup.lightCount} lights`
                  : 'Select a light group'
              }
            </div>
          </div>
        </ClickableMenuOption>
      )
    }

    render () {
      return (
        <div className={settings}>
          {this.renderDeviceOption()}
          {this.renderHueOption()}
        </div>
      )
    }
  },
)
