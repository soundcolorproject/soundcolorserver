
import { RefObject, useLayoutEffect, useRef, useState } from 'react'

import { logger } from '../../shared/logger'

export interface DimensionObject {
  readonly width: number
  readonly height: number
  readonly top: number
  readonly left: number
  readonly right: number
  readonly bottom: number
  readonly x: number
  readonly y: number
}

const defaultDims = Object.freeze<DimensionObject>({
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  x: 0,
  y: 0,
})

let prevRef: any
let prevDim: any
export function useDimensions<T extends HTMLElement> (recompute?: any): [RefObject<T>, DimensionObject] {
  const ref = useRef<T>(null)
  const [dimensions, setDimensions] = useState<DimensionObject>(defaultDims)

  useLayoutEffect(() => {
    const cur = ref.current
    if (cur) {
      requestAnimationFrame(() => {
        setDimensions(cur.getBoundingClientRect().toJSON())
      })
    }
  }, [
    recompute,
    ref.current,
    ref.current?.clientHeight,
    ref.current?.clientWidth,
    ref.current?.clientLeft,
    ref.current?.clientTop,
  ])

  prevRef = ref.current
  prevDim = dimensions

  return [ref, dimensions]
}
