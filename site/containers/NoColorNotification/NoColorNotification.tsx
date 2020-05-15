
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { PatternsProp } from '../../state/patternsStore'
import { RenderStateProp } from '../../state/renderStateStore'
import { ToneInfo } from '../../audio/getAnalysis'

import { noColorNotification } from './noColorNotification.pcss'

interface OwnProps {
  height?: number
  domRef?: React.Ref<HTMLDivElement>
}

type StateProps =
  & PatternsProp
  & RenderStateProp

export type SoundDetailsProps = OwnProps & StateProps

export const NoColorNotification = injectAndObserve<StateProps, OwnProps>(
  ({ patterns, renderState }) => ({ patterns, renderState }),
  class NoColorNotification extends React.Component<SoundDetailsProps> {
    render () {
      const { patterns, renderState, domRef } = this.props
      const { currentPattern } = patterns
      const { showColors } = renderState
      if (!currentPattern) {
        return (
          <div className={noColorNotification}>
            <h2>Hit play or select a color pattern to begin</h2>
          </div>
        )
      }
      if (!showColors) {
        return (
          <div className={noColorNotification}>
            <h2>Color pattern stopped.</h2>
          </div>
        )
      }

      return <div className={noColorNotification} />
    }
  },
)
