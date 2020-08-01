
import Pickr from '@simonwep/pickr'
import * as classNames from 'classnames'
import * as React from 'react'

import { logger } from '../../../shared/logger'
import { Color, getContrastingColor, HSVa, toHsv } from '../../pcss-functions'

import { colorPicker } from './colorPicker.pcss'

export interface ColorPickerProps {
  value: Color
  onChange: (value: HSVa) => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

interface PickrDetails {
  pickr: Pickr
  wrapper: HTMLElement
}

function killSave (instance = pickr) {
  if (instance && activeSave) {
    instance.off('save', activeSave)
    activeSave = null
  }
}

let activeSave: Function | null = null
let pickr: Pickr | null = null
let pickrWrapper: HTMLDivElement | null = null
function getPickr (): PickrDetails {
  if (!pickr || !pickrWrapper) {
    logger.info('creating pickr')

    pickrWrapper = document.createElement('div')
    pickrWrapper.style.position = 'fixed'
    pickrWrapper.style.top = '-10000px'
    pickrWrapper.style.left = '-10000px'

    pickr = Pickr.create({
      el: pickrWrapper,
      theme: 'nano',
      useAsButton: true,
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

    const onCancel = (hide = false) => (instance: Pickr) => {
      killSave(instance)
      pickrWrapper!.style.top = '-10000px'
      pickrWrapper!.style.left = '-10000px'
      if (hide) instance.hide()
    }

    pickr.on('hide', onCancel())
    pickr.on('cancel', onCancel(true))
  }

  return {
    pickr,
    wrapper: pickrWrapper,
  }
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
  const pickrRef = React.useRef<PickrDetails>()

  React.useEffect(() => {
    pickrRef.current = getPickr()
  }, [])

  const onClick = React.useCallback(() => {
    const pickr = pickrRef.current?.pickr
    const wrapper = pickrRef.current?.wrapper
    if (!pickr || !wrapper) {
      return
    }

    const buttonRect = buttonRef.current!.getBoundingClientRect()
    const onSave = (color: Pickr.HSVaColor, instance: Pickr) => {
      logger.info('Saving')
      onChange(toHsv(color.toHEXA().toString()))
      instance.hide()
      killSave(instance)
    }

    const { app } = pickr.getRoot() as { app: HTMLElement }

    killSave(pickr)
    pickr.setColor(value.toString())
    activeSave = onSave
    pickr.on('save', onSave)
    pickr.show()
    app.style.left = `${buttonRect.left}px`
    app.style.top = `${buttonRect.top}px`

  }, [pickrRef.current, pickr, value, onChange])

  return (
    <button
      ref={buttonRef}
      type='button'
      onClick={onClick}
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
