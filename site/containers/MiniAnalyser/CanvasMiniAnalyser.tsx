
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { AnalysisProp } from '../../state/analysisStore'

import { miniAnalyser, bar } from './miniAnalyser.pcss'
import { RenderStateProp } from '../../state/renderStateStore'

interface OwnProps {
}

type StateProps = AnalysisProp & RenderStateProp

export type CanvasMiniAnalyserProps = OwnProps & StateProps

function renderAnalyser (context: CanvasRenderingContext2D, miniFft: Float32Array, width: number, height: number) {
  const heights = [...miniFft].map(dB => height - (BASE ** (dB / 10)) * height)
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

function useContext (): [React.RefObject<HTMLCanvasElement>, CanvasRenderingContext2D | null] {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(null)

  React.useEffect(() => {
    if (ref.current) {
      setContext(ref.current.getContext('2d'))
    } else {
      setContext(null)
    }
  }, [ref.current])

  return [ref, context]
}

const BASE = 1.5
export const CanvasMiniAnalyser = injectAndObserve<StateProps, OwnProps>(
  ({ analysis, renderState }) => ({ analysis, renderState }),
  function CanvasMiniAnalyser (props: CanvasMiniAnalyserProps) {
    const { analysis, renderState } = props
    const [ref, context] = useContext()
    // tslint:disable-next-line: no-unused-expression
    analysis.tones // required in order to force-re-render on update

    if (context) {
      const width = ref.current?.width || window.innerWidth
      if (!renderState.showColors) {
        context.clearRect(0, 0, width, 500)
      } else {
        renderAnalyser(context, analysis.miniFft, width, 500)
      }
    }
    return (
      <canvas ref={ref} id={miniAnalyser} height={500} width={window.innerWidth} />
    )
  },
)
