
import * as React from 'react'
import { Icon } from '../../components/Icon'
import { ClickableMenuOption } from '../../components/MenuOption'
import { injectAndObserve } from '../../state/injectAndObserve'
import { FavoriteData, PatternsProp } from '../../state/patternsStore'

import {
  favoriteSelector,
  favoriteItem,
  favoriteData,
  favoriteDate,
  favoriteColors,
  favoriteColor,
  deleteFavorite,
} from './favoriteSelector.pcss'
import { logger } from '../../../shared/logger'
import { BackOption } from '../BackOption'

interface OwnProps {
}

type StateProps =
  & PatternsProp

export type FavoriteSelectorProps = OwnProps & StateProps

export const FavoriteSelector = injectAndObserve<StateProps, OwnProps>(
  ({ patterns }) => ({ patterns }),
  class FavoriteSelector extends React.Component<FavoriteSelectorProps> {
    loadFavorite = (key: string) => () => {
      logger.log('loadFavorite')
      this.props.patterns.loadFavorite(key)
    }

    deleteFavorite = (key: string) => (ev: React.MouseEvent) => {
      logger.log('deleteFavorite')
      ev.stopPropagation()
      ev.preventDefault()
      this.props.patterns.deleteFavorite(key)
    }

    renderFavorite = (key: string, fav: FavoriteData) => {
      const { patterns: { notes } } = this.props
      return (
        <ClickableMenuOption
          key={key}
          className={favoriteItem}
          onClick={this.loadFavorite(key)}
        >
          <>
            <div className={favoriteData}>
              <div className={favoriteDate}>{fav.created.toLocaleString()}</div>
              <div className={favoriteColors}>
                {
                  notes.map(note => {
                    const color = fav.colors[note]
                    return (
                      <div
                        key={note}
                        className={favoriteColor}
                        style={{ background: color.toString() }}
                      />
                    )
                  })
                }
              </div>
            </div>
            <span
              tabIndex={0}
              role='button'
              className={deleteFavorite}
              onClick={this.deleteFavorite(key)}
            >
              <Icon
                color='var(--grey-60)'
                name='delete'
              />
            </span>
          </>
        </ClickableMenuOption>
      )
    }

    render () {
      const { patterns } = this.props
      const faveKeys = Object.keys(patterns.favorites)
      return (
        <div className={favoriteSelector}>
          <BackOption name='Favorites' />
          {
            faveKeys.map(key => (
              this.renderFavorite(key, patterns.favorites[key])
            ))
          }
        </div>
      )
    }
  },
)
