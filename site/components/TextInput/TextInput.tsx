
import * as React from 'react'
import * as classNames from 'classnames'

import {
  textInput,
  placeholderText,
} from './textInput.pcss'

interface Props {
  placeholder: string
  value: string
  onChange: (value: string) => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

export const TextInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    placeholder,
    value,
    children,
    onChange,
    className,
    style,
    'data-testid': testid = 'text-input',
  } = props

  const handleChange = React.useMemo(() => (ev: React.ChangeEvent<HTMLInputElement>) => {
    onChange(ev.currentTarget.value)
  }, [onChange])

  return (
    <div
      className={classNames(textInput, className)}
      style={style}
      data-testid={testid}
    >
      <input ref={ref} value={value} onChange={handleChange} data-testid={`${testid}-input`} />
      <div className={placeholderText} data-testid={`${testid}-placeholder`}>
        {placeholder}
      </div>
      {children}
    </div>
  )
})
