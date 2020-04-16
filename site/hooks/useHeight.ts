
import * as React from 'react'
import { render } from 'react-dom'
import { raf } from './useTransition'

export function useHeight (child: React.ReactElement, width?: number, defaultVal = 100): number {
  const [{ child: calcForChild, width: calcForWidth }, setCalcFor] = React.useState({ child, width })
  const [height, setHeight] = React.useState(defaultVal)
  const [done, setDone] = React.useState(false)

  if (done && calcForChild === child && calcForWidth === width) {
    return height
  }

  const div = document.createElement('div')
  div.style.opacity = '0'
  div.style.position = 'fixed'
  div.style.left = '-10000px'
  div.style.top = '-10000px'
  div.style.pointerEvents = 'none'
  if (width) {
    div.style.width = `${width}px`
  }
  document.body.appendChild(div)
  render(child, div, () => {
    setCalcFor({ child, width })
    setHeight(div.clientHeight)
    setDone(true)
    div.remove()
  })

  return height
}
