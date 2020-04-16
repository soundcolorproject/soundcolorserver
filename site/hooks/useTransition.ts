
import * as React from 'react'

export function raf (count: number) {
  return new Promise(resolve => {
    function next () {
      if (count-- > 0) {
        requestAnimationFrame(next)
      } else {
        resolve()
      }
    }
    requestAnimationFrame(next)
  })
}

export function useTransition (children: React.ReactElement, transitionTime: number): [React.ReactElement | null, boolean] {
  const [prev1, setPrev1] = React.useState(children)
  const [prev2, setPrev2] = React.useState(children)
  const [timer, setTimer] = React.useState<any>(null)
  const [transition, setTransition] = React.useState(false)

  React.useEffect(() => {
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
  }, [children])

  React.useEffect(() => {
    if (prev2 !== children && !transition) {
      raf(2).then(() => {
        setTransition(true)
        setTimer(setTimeout(() => {
          setPrev2(children)
          setTimer(null)
        }, transitionTime))
      }).catch()
    }
  }, [prev1])

  if (prev2 === children) {
    return [null, false]
  }

  return [prev2, transition]
}
