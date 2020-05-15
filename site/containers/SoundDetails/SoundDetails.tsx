
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { AnalysisProp } from '../../state/analysisStore'
import { PatternsProp } from '../../state/patternsStore'
import { RenderStateProp } from '../../state/renderStateStore'
import { ToneInfo } from '../../audio/getAnalysis'

import { soundDetails, detail, name, value } from './soundDetails.pcss'

interface OwnProps {
  height?: number
  domRef?: React.Ref<HTMLDivElement>
}

type StateProps =
  & AnalysisProp

export type SoundDetailsProps = OwnProps & StateProps

export const SoundDetails = injectAndObserve<StateProps, OwnProps>(
  ({ analysis }) => ({ analysis }),
  class SoundDetails extends React.Component<SoundDetailsProps> {
    renderDetails = ({ dB, frequency, note: { note, cents, octave } }: ToneInfo, idx: number) => {
      return (
        <>
          <div className={detail}>
            <span className={name}>Tone volume: </span>
            <span className={value}>{dB.toFixed(0)} dB</span>
          </div>
          <div className={detail}>
            <span className={name}>Frequency: </span>
            <span className={value}>{frequency.toFixed(2)} hz</span>
          </div>
          <div className={detail}>
            <span className={name}>Note: </span>
            <span className={value}>{note} {octave}</span>
          </div>
          <div className={detail}>
            <span className={name}>Cents ♭: </span>
            <span className={value}>{cents.toFixed(2)}</span>
          </div>
        </>
      )
    }

    renderEmptyDetails = () => (
      <>
        <div className={detail}>
          <span className={name}>Tone volume: </span>
          <span className={value}>•</span>
        </div>
        <div className={detail}>
          <span className={name}>Frequency: </span>
          <span className={value}>•</span>
        </div>
        <div className={detail}>
          <span className={name}>Note: </span>
          <span className={value}>•</span>
        </div>
        <div className={detail}>
          <span className={name}>Cents ♭: </span>
          <span className={value}>•</span>
        </div>
      </>
    )

    render () {
      const { analysis, domRef } = this.props
      const { noise, tones } = analysis

      return (
        <div ref={domRef} className={soundDetails}>
          <div className={detail}>
            <span className={name}>Noise volume: </span>
            <span className={value}>
              {
                Number.isFinite(noise) && noise !== 0
                  ? `${noise.toFixed(0)} dB`
                  : '•'
              }
            </span>
          </div>
          {
            tones.length > 0
              ? this.renderDetails(tones[0], 0)
              : this.renderEmptyDetails()
          }
        </div>
      )
    }
  },
)
