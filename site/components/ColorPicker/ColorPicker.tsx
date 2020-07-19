
import * as React from 'react'
import * as classNames from 'classnames'
import Pickr from '@simonwep/pickr'

import { Color, HSVa, toHsv, getContrastingColor } from '../../pcss-functions'

import { colorPicker } from './colorPicker.pcss'

export interface ColorPickerProps {
  value: Color
  onChange: (value: HSVa) => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

export function ColorPicker (props: ColorPickerProps) {
  const {
    value,
    onChange,
    children,
    className,
    style,
    'data-testid': testid = 'color-picker',
  } = props

  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const pickrRef = React.useRef<Pickr>()
  const savingRef = React.useRef<boolean>()

  function killPickrRef (force?: boolean) {
    if (
      force ||
      pickrRef.current &&
      (pickrRef.current as any).options.el !== buttonRef.current &&
      (pickrRef.current as any)._eventBindings
    ) {
      pickrRef.current?.destroyAndRemove()
    }
  }

  React.useEffect(() => {
    if (buttonRef.current) {
      const newPicker = Pickr.create({
        el: buttonRef.current,
        theme: 'nano',
        useAsButton: true,
        default: value.toString(),
        components: {
          palette: false,
          preview: true,
          opacity: false,
          hue: true,
          interaction: {
            input: true,
            save: true,
            cancel: true,
          },
        },
      })

      newPicker.on('cancel', (instance: Pickr) => {
        instance.hide()
      })

      newPicker.on('save', (color: Pickr.HSVaColor, instance: Pickr) => {
        if (!savingRef.current) {
          onChange(toHsv(color.toHEXA().toString()))
          instance.hide()
        }
      })

      pickrRef.current = newPicker
    }

    return killPickrRef
  }, [buttonRef.current])

  React.useEffect(() => {
    savingRef.current = true
    pickrRef.current?.setColor(value.toString())
    savingRef.current = false
  }, [value])

  return (
    <button
      ref={buttonRef}
      key='color-pickr'
      className={classNames(colorPicker, className)}
      style={{
        ...style,
        backgroundColor: value.toString(),
        color: getContrastingColor(value),
      }}
      data-testid={testid}
    >
      {children}
    </button>
  )
}
