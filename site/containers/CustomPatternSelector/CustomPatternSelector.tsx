
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { PatternsProp, Note } from '../../state/patternsStore'

import {
  customPatternSelector,
  navigation,
  navigationButton,
  colorButtons,
  colorButton,
} from './customPatternSelector.pcss'
import { RoutingProp } from '../../state/routingStore'
import { Icon } from '../../components/Icon'
import { ColorPicker } from '../ColorPicker'

interface OwnProps {
  height?: number
  domRef?: React.Ref<HTMLDivElement>
}

type StateProps =
  & PatternsProp
  & RoutingProp

export type CustomPatternSelectorProps = OwnProps & StateProps

export const CustomPatternSelector = injectAndObserve<StateProps, OwnProps>(
  ({ patterns, routing }) => ({ patterns, routing }),
  class CustomPatternSelector extends React.Component<CustomPatternSelectorProps> {
    goBack = (ev: React.MouseEvent) => {
      ev.preventDefault()
      this.props.routing.popSubroute()
    }

    toggleFavorite = (ev: React.MouseEvent) => {
      const { patterns } = this.props
      ev.preventDefault()
      if (patterns.favoriteKey === null) {
        this.props.patterns.saveFavorite()
      } else {
        patterns.deleteFavorite(patterns.favoriteKey)
      }
    }

    resetColors = (ev: React.MouseEvent) => {
      ev.preventDefault()
      this.props.patterns.patternData.custom.colors.reset()
    }

    renderNavigation = () => (
      <div className={navigation}>
        <button
          type='button'
          role='button'
          className={navigationButton}
          onClick={this.goBack}
        >
          <Icon color='var(--black)' name='arrow_back' />
        </button>
        <button
          type='button'
          role='button'
          className={navigationButton}
          onClick={this.toggleFavorite}
        >
          <Icon
            color='var(--black)'
            name={
              this.props.patterns.favoriteKey === null
                ? 'favorite_border'
                : 'favorite'
            }
          />
        </button>
        <button
          type='button'
          role='button'
          className={navigationButton}
          onClick={this.resetColors}
        >
          <Icon color='var(--black)' name='refresh' />
        </button>
      </div>
    )

    renderColorButton = (note: Note) => (
      <ColorPicker
        key={note}
        className={colorButton}
        note={note}
      />
    )

    renderColorButtons = () => (
      <div className={colorButtons}>
        {
          this.props.patterns.notes.map(this.renderColorButton)
        }
      </div>
    )

    render () {
      const { domRef } = this.props
      return (
        <div ref={domRef} className={customPatternSelector}>
          {this.renderNavigation()}
          {this.renderColorButtons()}
        </div>
      )
    }
  },
)
