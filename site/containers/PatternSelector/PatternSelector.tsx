
import * as React from 'react'
import * as cn from 'classnames'

import { injectAndObserve } from '../../state/injectAndObserve'
import { PatternsProp, PatternName } from '../../state/patternsStore'
import { RenderStateProp, togglePattern } from '../../state/renderStateStore'
import { RoutingProp } from '../../state/routingStore'

import { patternSelector, patternOption, selected } from './patternSelector.pcss'

interface OwnProps {
  height?: number
  domRef?: React.Ref<HTMLDivElement>
}

type StateProps =
  & PatternsProp
  & RenderStateProp
  & RoutingProp

export type PatternSelectorProps = OwnProps & StateProps

export const PatternSelector = injectAndObserve<StateProps, OwnProps>(
  ({ patterns, renderState, routing }) => ({ patterns, renderState, routing }),
  class PatternSelector extends React.Component<PatternSelectorProps> {
    setPattern = (pattern: PatternName) => {
      const { patterns, renderState, routing } = this.props
      patterns.currentPattern = pattern
      if (pattern === 'custom') {
        routing.goToSubroute('customPalette')
      }
      if (!renderState.showColors) {
        togglePattern(patterns, renderState)
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
