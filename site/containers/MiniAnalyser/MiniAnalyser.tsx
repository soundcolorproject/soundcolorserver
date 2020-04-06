
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { AnalysisProp } from '../../state/analysisStore'

import { miniAnalyser, bar } from './miniAnalyser.pcss'

interface OwnProps {
}

type StateProps = AnalysisProp

export type MiniAnalyserProps = OwnProps & StateProps

const BASE = 1.5
export const MiniAnalyser = injectAndObserve<StateProps, OwnProps>(
  ({ analysis }) => ({ analysis }),
  class MiniAnalyser extends React.Component<MiniAnalyserProps> {
    render () {
      const { analysis } = this.props
      // tslint:disable-next-line: no-unused-expression
      analysis.tones // required in order to force-re-render on update
      const { miniFft } = analysis
      const heights = [...miniFft].map(dB => (BASE ** (dB / 10)) * 100)
      return (
        <div id={miniAnalyser}>
          {
            heights.map((height, idx) => (
              <div className={bar} key={idx} style={{ height: `${height}%` }} />
            ))
          }
        </div>
      )
    }
  },
)
