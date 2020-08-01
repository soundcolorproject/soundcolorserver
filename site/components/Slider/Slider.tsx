
import * as cn from 'classnames'
import * as React from 'react'

import { DisplayMapper } from '../../containers/ShaderCanvas/shaderName'

import {
  sliderDetails,
  sliderInput,
  sliderLabel,
  sliderValue,
} from './slider.pcss'

export interface SliderProps {
  label: string
  value: number
  onChange: (val: number) => void
  min: number
  max: number
  step?: number
  className?: string
  displayMapper?: DisplayMapper
  'data-testid'?: string
}

const DEFAULT_DISPLAY_MAPPER: DisplayMapper = (value, min, max) => ((value - min) / (max - min)).toFixed(2)
export function Slider (props: SliderProps) {
  const {
    label,
    value,
    onChange,
    min,
    max,
    step = (max - min) / 100,
    className,
    displayMapper = DEFAULT_DISPLAY_MAPPER,
    'data-testid': testid = 'slider',
  } = props

  const handleChange = React.useMemo(() => function handleChange (ev: React.ChangeEvent<HTMLInputElement>) {
    const value = parseFloat(ev.currentTarget.value)
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      onChange(0)
    } else {
      onChange(value)
    }
  }, [onChange])

  return (
    <label className={cn(sliderLabel, className)} data-testid={testid}>
      <div className={sliderDetails}>
        <div data-testid={`${testid}-label`}>{label}</div>
        <div className={sliderValue} data-testid={`${testid}-value`}>
          {displayMapper(value, min, max)}
        </div>
      </div>
      <input
        className={sliderInput}
        type='range' min={min} max={max} step={step}
        value={value}
        onChange={handleChange}
      />
    </label>
  )
}
