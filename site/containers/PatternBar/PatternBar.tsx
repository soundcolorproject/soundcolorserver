
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { PatternsProp, PatternName, Note, ColorMap } from '../../state/patternsStore'

import { patternBar, colorItem } from './patternBar.pcss'

interface OwnProps {
  patternName: PatternName
}

type StateProps = PatternsProp

export type BackOptionPropps = OwnProps & StateProps

export const PatternBar = injectAndObserve<StateProps, OwnProps>(
  ({ patterns }) => ({ patterns }),
  class PatternBar extends React.Component<BackOptionPropps> {
    renderNote = (colors: ColorMap) => (note: Note) => (
      <div key={note} className={colorItem} style={{ background: colors[note].toString() }} />
    )

    render () {
      const { patterns, patternName } = this.props
      const colors = patterns.patternData[patternName].colors
      return (
        <div className={patternBar}>
          {patterns.notes.map(this.renderNote(colors))}
        </div>
      )
    }
  },
)
