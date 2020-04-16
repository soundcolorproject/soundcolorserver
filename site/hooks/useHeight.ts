
import * as React from 'react'
import { render } from 'react-dom'
import { raf } from './useTransition'

export function useHeight (child: React.ReactElement, defaultVal = 100): number {
  const [calcFor, setCalcFor] = React.useState(child)
  const [height, setHeight] = React.useState(defaultVal)
  const [done, setDone] = React.useState(false)

  if (done && calcFor === child) {
    return height
  }

  const div = document.createElement('div')
  div.style.opacity = '0'
  div.style.position = 'fixed'
  div.style.left = '-10000px'
  div.style.top = '-10000px'
  div.style.pointerEvents = 'none'
  document.body.appendChild(div)
  render(child, div, () => {
    setCalcFor(child)
    setHeight(div.clientHeight)
    setDone(true)
    div.remove()
  })

  return height
}
