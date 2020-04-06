
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { resume } from '../../audio/context'
import { ColorPicker } from '../ColorPicker'
import { PatternsProp, PatternName } from '../../state/patternsStore'
import { logger } from '../../../shared/logger'

import { monochromatic, customColors } from './patternPicker.pcss'

interface OwnProps {
}

type StateProps = PatternsProp

export type PatternPickerProps = OwnProps & StateProps

export const PatternPicker = injectAndObserve<StateProps, OwnProps>(
  ({ patterns }) => ({ patterns }),
  class PatternPicker extends React.Component<PatternPickerProps> {
    setPattern (pattern: PatternName) {
      resume().catch(e => {
        logger.error('Failed to resume audio analysis:', e)
      })
      this.props.patterns.currentPattern = pattern
    }

    renderCustomButtons () {
      if (this.props.patterns.currentPattern === 'custom') {
        return (
          <div id={customColors}>
            {
              this.props.patterns.notes.map(note => (
                <ColorPicker note={note} />
              ))
            }
            <button
              type='button'
              role='button'
              aria-label='reset custom colors'
              onClick={this.props.patterns.patternData.custom.colors.reset}
            >
              Reset
            </button>
          </div>
        )
      }
    }

    render () {
      const { patterns } = this.props
      const { currentPattern, patternData, monochrome } = patterns
      const possiblePatterns = Object.keys(patternData) as PatternName[]
      return (
        <>
          <div>
            {
              possiblePatterns.map(pattern => (
                <button key={pattern} type='button' onClick={() => this.setPattern(pattern)} disabled={pattern === currentPattern}>
                  {patternData[pattern].label}
                </button>
              ))
            }
            {this.renderCustomButtons()}
          </div>
          <label id={monochromatic}>
              <input
                type='checkbox'
                checked={monochrome}
                onChange={() => patterns.monochrome = !monochrome}
              />
              Monochromatic
          </label>
        </>
      )
    }
  },
)
