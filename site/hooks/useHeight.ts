
import * as React from 'react'
import { render } from 'react-dom'

export function useHeight (child: React.ReactElement, width?: number, defaultVal = 100): number {
  const [height, setHeight] = React.useState(defaultVal)

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
  requestAnimationFrame(() => {
    render(child, div, () => {
      const newHeight = div.clientHeight
      div.remove()
      if (newHeight === height) {
        return
      }

      setHeight(newHeight)
    })
  })

  return height
}
