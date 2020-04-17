
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { AnalysisProp } from '../../state/analysisStore'

import { miniAnalyser, bar } from './miniAnalyser.pcss'
import { RenderStateProp } from '../../state/renderStateStore'

interface OwnProps {
}

type StateProps = AnalysisProp & RenderStateProp

export type MiniAnalyserProps = OwnProps & StateProps

const BASE = 1.5
export const MiniAnalyser = injectAndObserve<StateProps, OwnProps>(
  ({ analysis, renderState }) => ({ analysis, renderState }),
  class MiniAnalyser extends React.Component<MiniAnalyserProps> {
    render () {
      const { analysis, renderState } = this.props
      // tslint:disable-next-line: no-unused-expression
      analysis.tones // required in order to force-re-render on update
      const { miniFft } = analysis
      const heights = [...miniFft].map(dB => (BASE ** (dB / 10)) * 100)
      return (
        <div id={miniAnalyser}>
          {
            renderState.showColors &&
            heights.map((height, idx) => (
              <div className={bar} key={idx} style={{ height: `${height}%` }} />
            ))
          }
        </div>
      )
    }
  },
)
