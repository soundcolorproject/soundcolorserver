
import * as React from 'react'
import { useStores } from '../../state/useStores'

import { clickReshow, textHider, hidden } from './textHider.pcss'
import { useObserver } from 'mobx-react'

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
