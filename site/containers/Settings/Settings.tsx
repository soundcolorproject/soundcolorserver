
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { ApiStatusProp } from '../../state/apiStatusStore'
import { MediaProp } from '../../state/mediaStore'
import { ClickableMenuOption, MenuOption, LinkMenuOption } from '../../components/MenuOption'

import { settings } from './settings.pcss'
import { RoutingProp } from '../../state/routingStore'
import { OverUnder } from '../../components/OverUnder'
import { PatternsProp } from '../../state/patternsStore'

interface OwnProps {
  height?: number
  domRef?: React.Ref<HTMLDivElement>
}

type StateProps =
  & ApiStatusProp
  & MediaProp
  & PatternsProp
  & RoutingProp

export type SettingsProps = OwnProps & StateProps

export const Settings = injectAndObserve<StateProps, OwnProps>(
  ({ apiStatus, media, patterns, routing }) => ({ apiStatus, media, patterns, routing }),
  class Settings extends React.Component<SettingsProps> {
    renderDeviceOption = () => {
      const { media: { possibleDevices, currentDeviceId }, routing } = this.props
      if (possibleDevices.length < 1) {
        return (
          <MenuOption>
            <OverUnder
              over='Audio Source'
              under='Looking for devices...'
            />
          </MenuOption>
        )
      }

      const currentDevice = possibleDevices.find(d => d.deviceId === currentDeviceId)

      return (
        <ClickableMenuOption
          icon='arrow_forward'
          onClick={() => routing.goToSubroute('audioSource')}
        >
          <OverUnder
            over='Audio Source'
            under={currentDevice?.label || 'Select a source'}
          />
        </ClickableMenuOption>
      )
    }

    renderHueOption = () => {
      const { apiStatus, routing } = this.props
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
            <OverUnder
              over='Philips Hue'
              under='Log in'
            />
          </LinkMenuOption>
        )
      }

      if (lightGroupFetchError) {
        return (
          <ClickableMenuOption
            icon='arrow_forward'
            onClick={() => routing.goToSubroute('hueRoot')}
          >
            <OverUnder
              over='Philips Hue'
              under='Failed to fetch lights!'
            />
          </ClickableMenuOption>
        )
      }

      if (loadingLightGroups || !lightGroups) {
        return (
          <MenuOption>
            <OverUnder
              over='Philips Hue'
              under='Finding light groups...'
            />
          </MenuOption>
        )
      }

      if (lightGroups.length < 1) {
        return (
          <ClickableMenuOption
            icon='arrow_forward'
            onClick={() => routing.goToSubroute('hueRoot')}
          >
            <OverUnder
              over='Philips Hue'
              under='No light groups found!'
            />
          </ClickableMenuOption>
        )
      }

      const lightGroup = lightGroups.find(g => g.id === lightGroupId)

      if (!lightGroup) {
        return (
          <ClickableMenuOption
            icon='arrow_forward'
            onClick={() => routing.goToSubroute('hueGroupSelector')}
          >
            <OverUnder
              over='Philips Hue'
              under='Select a light group'
            />
          </ClickableMenuOption>
        )
      }

      return (
        <ClickableMenuOption
          icon='arrow_forward'
          onClick={() => routing.goToSubroute('hueRoot')}
        >
          <OverUnder
            over='Philips Hue'
            under={
              lightGroup
                ? `${lightGroup.name} -- ${lightGroup.lightCount} lights`
                : 'Select a light group'
            }
          />
        </ClickableMenuOption>
      )
    }

    renderFavoritesOption = () => {
      const { patterns, routing } = this.props
      const hasFavorites = Object.keys(patterns.favorites).length > 0

      if (hasFavorites) {
        return (
          <ClickableMenuOption
            icon='arrow_forward'
            onClick={() => routing.goToSubroute('favoriteCusom')}
          >
            <OverUnder
              over='Favorites'
              under='Select a Favorite Custom Pattern'
            />
          </ClickableMenuOption>
        )
      } else {
        return (
          <MenuOption>
            <OverUnder
              over='Favorites'
              under='No Custom Patterns Favorited'
            />
          </MenuOption>
        )
      }
    }

    render () {
      const { domRef } = this.props
      return (
        <div ref={domRef} className={settings}>
          {this.renderDeviceOption()}
          {this.renderHueOption()}
          {this.renderFavoritesOption()}
        </div>
      )
    }
  },
)
