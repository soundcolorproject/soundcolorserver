
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { AnalysisProp } from '../../state/analysisStore'
import { PatternsProp } from '../../state/patternsStore'
import { RenderStateProp } from '../../state/renderStateStore'
import { ToneInfo } from '../../audio/getAnalysis'

import { soundDetails, detail, name, value } from './soundDetails.pcss'

interface OwnProps {
}

type StateProps =
  & AnalysisProp
  & PatternsProp
  & RenderStateProp

export type SoundDetailsProps = OwnProps & StateProps

export const SoundDetails = injectAndObserve<StateProps, OwnProps>(
  ({ analysis, patterns, renderState }) => ({ analysis, patterns, renderState }),
  class SoundDetails extends React.Component<SoundDetailsProps> {
    renderDetails = ({ dB, frequency, note: { note, cents, octave } }: ToneInfo, idx: number) => {
      return (
        <div id={soundDetails}>
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
        </div>
      )
    }

    renderEmptyDetails = () => (
      <>
        <div>
          <span className='name'>Tone volume: </span>
          <span className='value'>•</span>
        </div>
        <div>
          <span className='name'>Frequency: </span>
          <span className='value'>•</span>
        </div>
        <div>
          <span className='name'>Note: </span>
          <span className='value'>•</span>
        </div>
        <div>
          <span className='name'>Cents ♭: </span>
          <span className='value'>•</span>
        </div>
      </>
    )

    render () {
      const { analysis: { noise, tones }, patterns: { currentPattern }, renderState: { showColors } } = this.props
      if (!currentPattern) {
        return <h2>Please select a color pattern to begin</h2>
      }
      if (!showColors) {
        return <h2>Press enter again to resume the color pattern</h2>
      }

      return (
        <div id='sound-details'>
          {
            Number.isFinite(noise)
              ? (
                <div className='detail'>
                  <span className='name'>Noise volume: </span>
                  <span className='value'>{noise.toFixed(0)} dB</span>
                  {
                    tones.length > 0
                      ? this.renderDetails(tones[0], 0)
                      : this.renderEmptyDetails()
                  }
                </div>
              )
            : (
                <div className='detail'>
                  <span className='name'>Noise volume: </span>
                  <span className='value'>•</span>
                  {this.renderEmptyDetails()}
                </div>
              )
          }
        </div>
      )
    }
  },
)
