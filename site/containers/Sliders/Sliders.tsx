
import * as React from 'react'
import { action } from 'mobx'
import { injectAndObserve } from '../../state/injectAndObserve'
import { PatternsProp } from '../../state/patternsStore'

import { sliders, content } from './sliders.pcss'
import { Slider } from '../../components/Slider'

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

interface SliderInfo {
  label: string
  min: number
  max: number
  step?: number
}

const SLIDER_INFO: { [name in SliderName]: SliderInfo } = {
  transitionSpeed: {
    label: 'Color Transition Speed',
    min: 0.1,
    max: 1,
  },
  timeSmoothing: {
    label: 'Time Smoothing',
    min: 0,
    max: 0.99,
  },
  vibranceMultiplier: {
    label: 'Brightness',
    min: 0,
    max: 5,
  },
  noiseMultiplier: {
    label: 'Noise Desaturation',
    min: 0,
    max: 10,
  },
  minimumBrightness: {
    label: 'Minimum Brightness',
    min: 0,
    max: 1,
  },
}

const SLIDER_NAMES = Object.keys(SLIDER_INFO) as SliderName[]

export const Sliders = injectAndObserve<StateProps, OwnProps>(
  ({ patterns }) => ({ patterns }),
  class Sliders extends React.Component<SlidersProps> {
    private _setters: {
      [key in SliderName]?: (value: number) => void
    } = {}

    setValue = (name: SliderName) => {
      if (!this._setters[name]) {
        const func = (value: number) => {
          this.props.patterns[name] = value
        }
        this._setters[name] = action(`set:${name}`, func)
      }

      return this._setters[name]!
    }

    renderSlider = (name: SliderName) => {
      const value = this.props.patterns[name]
      const { label, min, max, step } = SLIDER_INFO[name]

      return (
        <Slider
          label={label}
          value={value}
          onChange={this.setValue(name)}
          min={min}
          max={max}
          step={step}
        />
      )
    }

    render () {
      const {
        domRef,
      } = this.props

      return (
        <div ref={domRef} id={sliders}>
          <div className={content}>
            {
              SLIDER_NAMES.map(this.renderSlider)
            }
          </div>
        </div>
      )
    }
  },
)
