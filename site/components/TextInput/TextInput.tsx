
import * as classNames from 'classnames'
import * as React from 'react'

import {
  inputWrapper,
  placeholderText,
  textInput,
} from './textInput.pcss'

export interface TextInputProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const {
    placeholder,
    value,
    children,
    onChange,
    className,
    style,
    'data-testid': testid = 'text-input',
  } = props

  const handleChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    onChange(ev.currentTarget.value)
  }, [onChange])

  return (
    <div
      className={classNames(textInput, className)}
      style={style}
      data-testid={testid}
    >
      <div className={inputWrapper}>
        <input ref={ref} value={value} onChange={handleChange} data-testid={`${testid}-input`} />
        <div className={placeholderText} data-testid={`${testid}-placeholder`}>
          {placeholder}
        </div>
      </div>
      {children}
    </div>
  )
})
