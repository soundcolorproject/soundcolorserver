
import * as cn from 'classnames'
import * as React from 'react'

import {
  checkboxDetails,
  checkboxInput,
  checkboxLabel,
  checkboxValue,
  switchMark,
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

  const switchRef = React.useRef<HTMLDivElement>(null)

  const handleChange = React.useCallback(
    function handleChange (ev: React.ChangeEvent<HTMLInputElement>) {
      onChange(ev.currentTarget.checked)
    },
    [onChange],
  )

  const handleLabelClick = React.useCallback(() => {
    if (switchRef.current) {
      switchRef.current.focus()
    }
  }, [])

  const handleKeydown = React.useCallback((ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault()
      ev.stopPropagation()
      onChange(!checked)
    }
  }, [onChange, checked])

  return (
    <label className={cn(checkboxLabel, className)} onClick={handleLabelClick}>
      <div className={checkboxDetails}>
        {label}
        <div className={checkboxValue}>{checked ? 'On' : 'Off'}</div>
      </div>
      <input
        className={checkboxInput}
        type='checkbox'
        checked={checked}
        onChange={handleChange}
      />
      <div
        ref={switchRef}
        className={switchMark}
        tabIndex={0}
        onKeyDown={handleKeydown}
      />
    </label>
  )
}
