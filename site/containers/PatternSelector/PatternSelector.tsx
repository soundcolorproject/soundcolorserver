
import * as React from 'react'
import * as cn from 'classnames'

import { logger } from '../../../shared/logger'
import { resume } from '../../audio/context'
import { injectAndObserve } from '../../state/injectAndObserve'
import { PatternsProp, PatternName } from '../../state/patternsStore'
import { RoutingProp } from '../../state/routingStore'

import { patternSelector, patternOption, selected } from './patternSelector.pcss'

interface OwnProps {
}

type StateProps = PatternsProp & RoutingProp

export type PatternSelectorProps = OwnProps & StateProps

export const PatternSelector = injectAndObserve<StateProps, OwnProps>(
  ({ patterns, routing }) => ({ patterns, routing }),
  class PatternSelector extends React.Component<PatternSelectorProps> {
    setPattern = (pattern: PatternName) => {
      resume().catch(e => {
        logger.error('Failed to resume audio analysis:', e)
      })
      this.props.patterns.currentPattern = pattern
      if (pattern === 'custom') {
        this.props.routing.goToSubroute('customPalette')
      }
    }

    renderPatternOption = (pattern: PatternName) => {
      const { patterns: { patternData, currentPattern } } = this.props
      return (
        <button
          type='button'
          role='button'
          className={cn({
            [patternOption]: true,
            [selected]: currentPattern === pattern,
          })}
          onClick={(ev) => {
            ev.preventDefault()
            this.setPattern(pattern)
          }}
        >
          {patternData[pattern].label}
        </button>
      )
    }

    render () {
      const { patterns: { patternData } } = this.props
      const possiblePatterns = Object.keys(patternData) as PatternName[]
      return (
        <div className={patternSelector}>
          {
            possiblePatterns.map(this.renderPatternOption)
          }
        </div>
      )
    }
  },
)
