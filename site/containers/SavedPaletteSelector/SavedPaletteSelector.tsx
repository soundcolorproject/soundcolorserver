
import * as React from 'react'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'

import { PanelButton } from '../../components/PanelButton'
import { Button } from '../../components/Button'
import { Panel } from '../../components/Panel'

import {
  savedPaletteSelector,
  favoriteButton,
  favoriteText,
  deleteButton,
} from './savedPaletteSelector.pcss'

export interface SavedPaletteSelectorProps extends RouteComponentProps {
  'data-testid'?: string
}

export const SavedPaletteSelector: React.FunctionComponent<SavedPaletteSelectorProps> = function SavedPaletteSelector (props: SavedPaletteSelectorProps) {
  const {
    'data-testid': testid = 'saved-palette-selector',
  } = props
  const { patterns } = useStores()

  const setCustomColors = (name: string) => () => {
    patterns.loadFavorite(name)
  }

  const deleteFavorite = (name: string) => () => {
    patterns.deleteFavorite(name)
  }

  const renderFavorites = () => {
    const names = Object.keys(patterns.favorites)
    return names.map(name => (
      <PanelButton
        key={name}
        className={favoriteButton}
        onClick={setCustomColors(name)}
        endButton={{
          text: 'Delete',
          onClick: deleteFavorite(name),
          color: '#FC5719',
        }}
      >
        {name}
      </PanelButton>
    ))
  }

  return useObserver(() => (
    <Panel title='Saved' className={savedPaletteSelector} data-testid={testid}>
      {renderFavorites()}
    </Panel>
  ))
}
