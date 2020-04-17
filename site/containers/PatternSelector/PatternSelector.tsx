
import * as React from 'react'
import * as cn from 'classnames'

import { logger } from '../../../shared/logger'
import { resume } from '../../audio/context'
import { injectAndObserve } from '../../state/injectAndObserve'
import { PatternsProp, PatternName } from '../../state/patternsStore'
import { RoutingProp } from '../../state/routingStore'

import { patternSelector, patternOption, selected } from './patternSelector.pcss'

interface OwnProps {
  height?: number
  domRef?: React.Ref<HTMLDivElement>
}

type StateProps = PatternsProp & RoutingProp

export type PatternSelectorProps = OwnProps & StateProps

export const PatternSelector = injectAndObserve<StateProps, OwnProps>(
  ({ patterns, routing }) => ({ patterns, routing }),
  class PatternSelector extends React.Component<PatternSelectorProps> {
    setPattern = (pattern: PatternName) => {
      this.props.patterns.currentPattern = pattern
      if (pattern === 'custom') {
        this.props.routing.goToSubroute('customPalette')
      }
    }

    renderPatternOption = (pattern: PatternName) => {
      const { patterns: { patternData, currentPattern } } = this.props
      return (
        <button
          key={pattern}
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
      const { patterns: { patternData }, domRef } = this.props
      const possiblePatterns = Object.keys(patternData) as PatternName[]
      return (
        <div ref={domRef} className={patternSelector}>
          {
            possiblePatterns.map(this.renderPatternOption)
          }
        </div>
      )
    }
  },
)
