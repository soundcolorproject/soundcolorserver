
import * as React from 'react'
import * as cn from 'classnames'

import {
  checkboxLabel,
  checkboxInput,
} from './checkbox.pcss'

export interface SliderProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function Checkbox (props: SliderProps) {
  const {
    label,
    checked,
    onChange,
    className,
  } = props

  const handleChange = React.useMemo(() => (
    function handleChange (ev: React.ChangeEvent<HTMLInputElement>) {
      onChange(ev.currentTarget.checked)
    }
  ), [onChange])

  return (
    <label className={cn(checkboxLabel, className)}>
      <input
        className={checkboxInput}
        type='checkbox'
        checked={checked}
        onChange={handleChange}
      />
      {label}
    </label>
  )
}
