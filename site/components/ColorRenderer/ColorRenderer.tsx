
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { PatternsProp } from '../../state/patternsStore'
import { RenderStateProp } from '../../state/renderStateStore'
import { AnalysisProp } from '../../state/analysisStore'

import { backgroundColors, color } from './colorRenderer.pcss'
import { getColorsFromAnalysis } from '../../helpers/analysisColors'

interface OwnProps {

}

type StateProps =
  & AnalysisProp
  & PatternsProp
  & RenderStateProp

export type ColorRendererProps = OwnProps & StateProps

export const ColorRenderer = injectAndObserve<StateProps, OwnProps>(
  ({ analysis, patterns, renderState }) => ({ analysis, patterns, renderState }),
  class ColorRenderer extends React.Component<ColorRendererProps> {
    render () {
      const { analysis, patterns, renderState: { showColors } } = this.props
      if (!showColors) {
        return null
      }
      const { currentPattern, patternData } = patterns
      const pattern = patternData[currentPattern]
      if (!pattern) {
        return <div id={backgroundColors} />
      }
      const [backgroundColor] = getColorsFromAnalysis(analysis, patterns)

      return (
        <div id={backgroundColors}>
          <div className={color} style={{ background: backgroundColor?.toString() || '#000' }} />
        </div>
      )
    }
  },
)
