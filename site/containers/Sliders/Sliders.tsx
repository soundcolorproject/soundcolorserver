
import * as React from 'react'
import { action } from 'mobx'
import { injectAndObserve } from '../../state/injectAndObserve'
import { PatternsProp, PatternsStore } from '../../state/patternsStore'

import { sliders } from './sliders.pcss'

interface OwnProps {
}

type StateProps = PatternsProp

export type SlidersProps = OwnProps & StateProps

type SliderName =
  | 'transitionSpeed'
  | 'vibranceMultiplier'
  | 'noiseMultiplier'
  | 'timeSmoothing'

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
          toneSigma,
          timeSmoothing,
        },
      } = this.props

      return (
        <div id={sliders}>
          <label>
            Color Transition Speed
            <input
              type='range' min='0.1' step='0.01' max='1'
              value={transitionSpeed}
              onChange={this.setValue('transitionSpeed')}
            />
          </label>
          <label>
            Brightness
            <input
              type='range' min='0' step='0.01' max='5'
              value={vibranceMultiplier}
              onChange={this.setValue('vibranceMultiplier')}
            />
          </label>
          <label>
            Noise Desaturation
            <input
              type='range' min='-0.01' step='0.01' max='10'
              value={noiseMultiplier}
              onChange={this.setValue('noiseMultiplier')}
            />
          </label>
          {/*<label>
            Required tone strength
            <input
              type='range' min='0' step='0.01' max='10'
              value={toneSigma}
              onChange={this.setValue('toneSigma')}
            />
          </label>*/}
          <label>
            Time Smoothing
            <input
              type='range' min='0' step='0.01' max='0.99'
              value={timeSmoothing}
              onChange={this.setValue('timeSmoothing')}
            />
          </label>
        </div>
      )
    }
  },
)
