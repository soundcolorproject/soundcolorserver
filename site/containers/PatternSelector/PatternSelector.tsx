
import { RouteComponentProps } from '@reach/router'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { Panel } from '../../components/Panel'
import { PanelButton } from '../../components/PanelButton'
import { PatternName } from '../../state/patternsStore'
import { togglePattern } from '../../state/renderStateStore'
import { useStores } from '../../state/useStores'

export interface PatternSelectorProps extends RouteComponentProps {
}

export const PatternSelector: React.FunctionComponent<PatternSelectorProps> = function PatternSelector (_props) {
  const { patterns, renderState } = useStores()
  const setPattern = (name: PatternName) => React.useCallback(() => {
    patterns.currentPattern = name
    if (!renderState.showColors) {
      togglePattern(patterns, renderState)
    }
  }, [patterns, name])

  return useObserver(() => (
    <Panel title='Color Patterns' data-testid='pattern-selector'>
      <PanelButton
        toRoute='favoriteCusom'
        endIcon='play'
        suffix={Object.keys(patterns.favorites).length}
      >
        Saved
      </PanelButton>
      {
        patterns.patternNames.map(name => {
          if (name === 'custom') {
            const data = patterns.patternData.custom
            return (
              <PanelButton
                key={name}
                onClick={setPattern('custom')}
                toRoute='customPalette'
                active={patterns.currentPattern === name}
                hoverColor={data.defaultColors[data.buttonNoteColor].toString()}
                endIcon='play'
              >
                {data.label}
              </PanelButton>
            )
          }

          const data = patterns.patternData[name]
          return (
            <PanelButton
              key={name}
              onClick={setPattern(name)}
              active={patterns.currentPattern === name}
              hoverColor={data.colors[data.buttonNoteColor].toString()}
              data-testid={`pattern-button-${name}`}
            >
              {data.label}
            </PanelButton>
          )
        })
      }
    </Panel>
  ))
}
