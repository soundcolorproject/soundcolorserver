
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { RenderStateProp } from '../../state/renderStateStore/index'

import { textHider, hidden } from './textHider.pcss'

interface OwnProps {
}

type StateProps = RenderStateProp

export type TextHiderProps = OwnProps & StateProps

export const TextHider = injectAndObserve<StateProps, OwnProps>(
  ({ renderState }) => ({ renderState }),
  class TextHider extends React.Component<TextHiderProps> {
    render () {
      const { children, renderState: { showText } } = this.props
      return (
        <div id={textHider} className={showText ? '' : hidden}>
          {children}
        </div>
      )
    }
  },
)
