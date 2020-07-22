
import * as React from 'react'
import * as cn from 'classnames'

import {
  sliderLabel,
  sliderDetails,
  sliderValue,
  sliderInput,
} from './slider.pcss'

export interface SliderProps {
  label: string
  value: number
  onChange: (val: number) => void
  min: number
  max: number
  step?: number
  className?: string
  'data-testid'?: string
}

export function Slider (props: SliderProps) {
  const {
    label,
    value,
    onChange,
    min,
    max,
    step = (max - min) / 100,
    className,
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
          {((value - min) / (max - min)).toFixed(2)}
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
