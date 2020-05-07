
import * as React from 'react'
import { action } from 'mobx'
import { injectAndObserve } from '../../state/injectAndObserve'
import { PatternsProp, PatternsStore } from '../../state/patternsStore'

import { sliders, detail, value } from './sliders.pcss'

interface OwnProps {
  height?: number
  domRef?: React.Ref<HTMLDivElement>
}

type StateProps = PatternsProp

export type SlidersProps = OwnProps & StateProps

type SliderName =
  | 'transitionSpeed'
  | 'vibranceMultiplier'
  | 'noiseMultiplier'
  | 'timeSmoothing'
  | 'minimumBrightness'

export const Sliders = injectAndObserve<StateProps, OwnProps>(
  ({ patterns }) => ({ patterns }),
  class Sliders extends React.Component<SlidersProps> {
    private _setters: {
      [key in SliderName]?: (ev: React.ChangeEvent<HTMLInputElement>) => void
    } = {}

    setValue = (name: SliderName) => {
      if (!this._setters[name]) {
        const func = (ev: React.ChangeEvent<HTMLInputElement>) => {
          this.props.patterns[name] = parseFloat(ev.target.value)
        }
        this._setters[name] = action(`set:${name}`, func)
      }

      return this._setters[name]
    }

    render () {
      const {
        patterns: {
          transitionSpeed,
          noiseMultiplier,
          vibranceMultiplier,
          minimumBrightness,
          timeSmoothing,
        },
        domRef,
      } = this.props

      return (
        <div ref={domRef} id={sliders}>
          <label>
            <div className={detail}>
              <div>Color Transition Speed</div>
              <div className={value}>
                {((transitionSpeed - 0.1) / 0.9).toFixed(2)}
              </div>
            </div>
            <input
              type='range' min='0.1' step='0.01' max='1'
              value={transitionSpeed}
              onChange={this.setValue('transitionSpeed')}
            />
          </label>
          <label>
            <div className={detail}>
              <div>Time Smoothing</div>
              <div className={value}>
                {(timeSmoothing / 0.99).toFixed(2)}
              </div>
            </div>
            <input
              type='range' min='0' step='0.01' max='0.99'
              value={timeSmoothing}
              onChange={this.setValue('timeSmoothing')}
            />
          </label>
          <label>
            <div className={detail}>
              <div>Brightness</div>
              <div className={value}>
                {(vibranceMultiplier / 5).toFixed(2)}
              </div>
            </div>
            <input
              type='range' min='0' step='0.01' max='5'
              value={vibranceMultiplier}
              onChange={this.setValue('vibranceMultiplier')}
            />
          </label>
          <label>
            <div className={detail}>
              <div>Noise Desaturation</div>
              <div className={value}>
                {(noiseMultiplier / 10).toFixed(2)}
              </div>
            </div>
            <input
              type='range' min='0' step='0.01' max='10'
              value={noiseMultiplier}
              onChange={this.setValue('noiseMultiplier')}
            />
          </label>
          <label>
            <div className={detail}>
              <div>Minimum Brightness</div>
              <div className={value}>
                {minimumBrightness.toFixed(2)}
              </div>
            </div>
            <input
              type='range' min='0' step='0.01' max='1'
              value={minimumBrightness}
              onChange={this.setValue('minimumBrightness')}
            />
          </label>
          {/*<label>
            <div className={detail}>
              <div>Required tone strength</div>
              <div className={value}>
                {(timeSmoothing / 10).toFixed(2)}
              </div>
            </div>
            <input
              type='range' min='0' step='0.01' max='10'
              value={toneSigma}
              onChange={this.setValue('toneSigma')}
            />
          </label>*/}
        </div>
      )
    }
  },
)
