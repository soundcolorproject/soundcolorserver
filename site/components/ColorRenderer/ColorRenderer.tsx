
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { dBtoVolume, Analysis } from '../../audio/getAnalysis'
import { PatternsProp, ColorMap, PatternsStore } from '../../state/patternsStore'
import { RenderStateProp } from '../../state/renderStateStore'
import { AnalysisProp } from '../../state/analysisStore'

import { backgroundColors, color } from './colorRenderer.pcss'
import { HSVa, toHsv } from '../../pcss-functions/toHsv'
import { RGBa, toRgb } from '../../pcss-functions/toRgb'

const smoothValues = {
  s: 0,
  v: 0,
  r: 0,
  g: 0,
  b: 0,
}

function smooth (color: RGBa | HSVa, key: keyof typeof smoothValues, delta: number, speed: number) {
  const smoothingVal = (1 - speed) ** (delta)
  return smoothValues[key] = smoothValues[key] * smoothingVal + (color as any)[key] * (1 - smoothingVal)
}

let lastTime = Date.now()
function getColorsFromAnalysis ({ noise, tones }: Analysis, { transitionSpeed, noiseMultiplier, vibranceMultiplier, monochrome, currentPattern, patternData }: PatternsStore): string[] {
  const colorMap = patternData[currentPattern].colors
  noiseMultiplier = noiseMultiplier >= 0 ? 2 ** noiseMultiplier : 0
  vibranceMultiplier = 2 ** vibranceMultiplier
  const saturationMult = Math.max(0, Math.min(1 - (dBtoVolume(noise) * noiseMultiplier), 1))
  const newTime = Date.now()
  const delta = (newTime - lastTime) / 1000
  lastTime = newTime
  return tones.map(({ dB, note: { note } }) => {
    const valueMult = Math.max(0, Math.min(dBtoVolume(dB) * vibranceMultiplier, 1))
    const hsv = colorMap[note].clone()
    hsv.s *= saturationMult
    hsv.v *= valueMult

    const rgb = toRgb(hsv)
    const { h } = toHsv(new RGBa(
      smooth(rgb, 'r', delta, transitionSpeed),
      smooth(rgb, 'g', delta, transitionSpeed),
      smooth(rgb, 'b', delta, transitionSpeed),
    ))

    return new HSVa(
      h,
      monochrome ? 0 : smooth(hsv, 's', delta, transitionSpeed),
      smooth(hsv, 'v', delta, transitionSpeed),
    ).toString()
  })
}

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
      const colors = getColorsFromAnalysis(analysis, patterns)

      return (
        <div id={backgroundColors}>
          <div className={color} style={{ background: colors[0] }} />
        </div>
      )
    }
  },
)
