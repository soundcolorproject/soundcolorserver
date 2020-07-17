
import * as React from 'react'

function isSameElement (el1: React.ReactElement | null, el2: React.ReactElement | null) {
  if (el1 === el2) {
    return true
  } else if (el1 === null || el2 === null) {
    return false
  } else {
    return el1.type === el2.type && el1.key === el2.key
  }
}

export function useTransition (children: React.ReactElement | null, transitionTime: number): [React.ReactElement | null, boolean] {
  const [prev1, setPrev1] = React.useState(children)
  const [prev2, setPrev2] = React.useState(children)
  const [timer, setTimer] = React.useState<any>(null)
  const [transition, setTransition] = React.useState(false)
  let cleanup = false

  function doCleanup () {
    cleanup = true
    clearTimeout(timer)
  }

  React.useEffect(() => {
    if (cleanup) {
      return doCleanup
    }
    if (!isSameElement(prev1, children)) {
      if (timer) {
        clearTimeout(timer)
        setTimer(null)
      }
      setPrev2(prev1)
      setPrev1(children)

      if (transition) {
        setTransition(false)
      }
    }
    return doCleanup
  }, [children])

  React.useEffect(() => {
    if (cleanup) {
      return doCleanup
    }
    if (isSameElement(prev1, children) && !transition) {
      setTimeout(() => {
        if (cleanup) {
          return
        }

        setTransition(true)
        setTimer(setTimeout(() => {
          if (cleanup) {
            return
          }
          setPrev2(children)
          setTimer(null)
        }, transitionTime))
      }, 10)
    }
    return doCleanup
  }, [prev1])

  if (isSameElement(prev2, children)) {
    return [null, false]
  }

  return [prev2, transition]
}
