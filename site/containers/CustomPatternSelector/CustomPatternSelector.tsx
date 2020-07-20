
import * as React from 'react'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'
import { Note } from '../../state/patternsStore'
import { HSVa } from '../../pcss-functions'

import { Panel } from '../../components/Panel'
import { ColorPicker } from '../../components/ColorPicker'

import { customPatternSelector, colorPickers, pickerRow, picker, patternName } from './customPatternSelector.pcss'
import { TextInput } from '../../components/TextInput'
import { Icon } from '../../components/Icon'
import { Button } from '../../components/Button'
import { logger } from '../../../shared/logger'

export interface CustomPatternSelectorProps extends RouteComponentProps {
  'data-testid'?: string
}

export const CustomPatternSelector: React.FunctionComponent<CustomPatternSelectorProps> = function CustomPatternSelector (props: CustomPatternSelectorProps) {
  const {
    'data-testid': testid = 'custom-pattern-selector',
  } = props

  const { patterns } = useStores()
  const [customName, setCustomName] = React.useState('')
  const [favoriteSaved, setFavoriteSaved] = React.useState(false)

  React.useEffect(() => {
    if (favoriteSaved) {
      setTimeout(() => {
        setFavoriteSaved(false)
      }, 3000)
    }
  }, [favoriteSaved])

  const getColor = (note: Note) => {
    return patterns.patternData.custom.colors[note]
  }

  const setColor = (note: Note) => (color: HSVa) => {
    patterns.patternData.custom.colors[note] = color
  }

  const renderPickers = () => {
    const noteRows = [
      patterns.notes.slice(0, 4),
      patterns.notes.slice(4, 8),
      patterns.notes.slice(8, 12),
    ]

    return (
      <div className={colorPickers} data-testid={`${testid}-color-pickers`}>
        {
          noteRows.map((notes, i) => (
            <div key={i} className={pickerRow} data-testid={`${testid}-pickers-row-${i}`}>
              {
                notes.map(note => (
                  <ColorPicker
                    key={note}
                    className={picker}
                    value={getColor(note)}
                    onChange={setColor(note)}
                    data-testid={`${testid}-picker-${note}`}
                  >
                    {note}
                  </ColorPicker>
                ))
              }
            </div>
          ))
        }
      </div>
    )
  }

  const saveCustom = (ev: React.FormEvent) => {
    ev.preventDefault()
    logger.info(`Saving pattern`, customName)
    patterns.saveFavorite(customName)
    setFavoriteSaved(true)
  }

  return useObserver(() => (
    <Panel title='Custom' button={{
      text: 'Reset',
      onClick: patterns.patternData.custom.colors.reset,
    }}>
      <div
        className={customPatternSelector}
        data-testid={testid}
      >
        {renderPickers()}
        <form onSubmit={saveCustom}>
          <TextInput
            className={patternName}
            placeholder='Custom Pattern Name'
            value={customName}
            onChange={setCustomName}
          >
            {
              favoriteSaved
                ? <div>Saved</div>
                : <Button type='submit'>
                    Save
                  </Button>
            }
          </TextInput>
        </form>
      </div>
    </Panel>
  ))
}
