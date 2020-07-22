
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
import { togglePattern } from '../../state/renderStateStore'
import { PanelDetail } from '../../components/PanelDetail'

export interface SavedPaletteSelectorProps extends RouteComponentProps {
  'data-testid'?: string
}

export const SavedPaletteSelector: React.FunctionComponent<SavedPaletteSelectorProps> = function SavedPaletteSelector (props: SavedPaletteSelectorProps) {
  const {
    'data-testid': testid = 'saved-palette-selector',
  } = props
  const { patterns, renderState } = useStores()

  const setCustomColors = (name: string) => () => {
    patterns.loadFavorite(name)
    if (!renderState.showColors) {
      togglePattern(patterns, renderState)
    }
  }

  const deleteFavorite = (name: string) => () => {
    patterns.deleteFavorite(name)
  }

  const renderFavorites = () => {
    const names = Object.keys(patterns.favorites)
    if (names.length === 0) {
      return (
        <PanelDetail>You have no custom patterns saved yet.</PanelDetail>
      )
    }
    return names.map((name, i) => (
      <PanelButton
        key={name}
        className={favoriteButton}
        onClick={setCustomColors(name)}
        endButton={{
          text: 'Delete',
          onClick: deleteFavorite(name),
          color: '#FC5719',
        }}
        data-testid={`${testid}-palette-button-${i}`}
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
