
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { RenderStateProp } from '../../state/renderStateStore'

import { clickReshow, textHider, hidden } from './textHider.pcss'

interface OwnProps {
}

type StateProps = RenderStateProp

export type TextHiderProps = OwnProps & StateProps

export const TextHider = injectAndObserve<StateProps, OwnProps>(
  ({ renderState }) => ({ renderState }),
  class TextHider extends React.Component<TextHiderProps> {
    reshow = () => {
      this.props.renderState.showText = true
    }
    render () {
      const { children, renderState: { showText } } = this.props
      return (
        <>
          { showText || <div id={clickReshow} onClick={this.reshow} /> }
          <div id={textHider} className={showText ? '' : hidden}>
            {children}
          </div>
        </>
      )
    }
  },
)
