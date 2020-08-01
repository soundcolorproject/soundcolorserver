
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { useStores } from '../../state/useStores'

import { clickReshow, hidden, textHider } from './textHider.pcss'

export interface TextHiderProps {
  children?: React.ReactNode
}

export function TextHider ({ children }: TextHiderProps) {
  const { renderState } = useStores()
  const reshow = React.useCallback(() => {
    renderState.showText = true
  }, [renderState])

  return useObserver(() => (
    <>
      { renderState.showText || <div id={clickReshow} onClick={reshow} /> }
      <div id={textHider} className={renderState.showText ? '' : hidden}>
        {children}
      </div>
    </>
  ))
}
