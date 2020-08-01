
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { useCanvasContext } from '../../hooks/useCanvasContext'
import { AnalysisProp } from '../../state/analysisStore'
import { RenderStateProp } from '../../state/renderStateStore'
import { useStores } from '../../state/useStores'

import { miniAnalyser } from './miniAnalyser.pcss'

interface OwnProps {
}

type StateProps = AnalysisProp & RenderStateProp

export type CanvasMiniAnalyserProps = OwnProps & StateProps

const BASE = 2
function renderAnalyser (context: CanvasRenderingContext2D, fft: Float32Array, width: number, height: number) {
  const heights = fft.map(dB => height - (BASE ** (dB / 10)) * height)
  context.clearRect(0, 0, width, height)
  const path = new Path2D()
  path.moveTo(0, heights[0])
  heights.slice(1).forEach((h, i) => {
    const x = (i + 1) / (heights.length - 1) * width
    path.lineTo(x, h)
  })
  path.lineTo(width, height)
  path.lineTo(0, height)
  path.closePath()
  context.fillStyle = 'rgba(255, 255, 255, 0.8)'
  context.fill(path)
}

export function CanvasMiniAnalyser () {
  const { analysis, renderState } = useStores()
  const [canvasRef, context] = useCanvasContext('2d')

  return useObserver(() => {
    // tslint:disable-next-line: no-unused-expression
    analysis.tones // required in order to force-re-render on update

    if (context) {
      const width = canvasRef.current?.width || window.innerWidth
      if (!renderState.showColors) {
        context.clearRect(0, 0, width, 500)
      } else {
        renderAnalyser(context, analysis.miniFft, width, 500)
      }
    }

    return (
      <canvas ref={canvasRef} id={miniAnalyser} height={500} width={window.innerWidth} />
    )
  })
}
