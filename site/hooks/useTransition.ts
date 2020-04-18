
import * as React from 'react'

export function useTransition (children: React.ReactElement, transitionTime: number): [React.ReactElement | null, boolean] {
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
    if (prev1 !== children) {
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
    if (prev2 !== children && !transition) {
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

  if (prev2 === children) {
    return [null, false]
  }

  return [prev2, transition]
}
