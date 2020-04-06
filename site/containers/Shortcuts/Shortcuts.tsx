
import * as React from 'react'

import { shortcuts } from './shortcuts.pcss'

export class Shortcuts extends React.Component {
  render () {
    return (
      <div id={shortcuts}>
        <div>
          <p><span>'space'</span> = show/hide details</p>
          <button aria-label='Hide page details'>Hide Details</button>
        </div>
        <div>
          <p><span>'enter'</span> = stop/start color pattern</p>
          <button aria-label='Stop the color pattern'>Stop Color Pattern</button>
        </div>
          {
            document.fullscreenEnabled
              ? <>
                  <p><span>'f'</span> = enter/leave fullscreen</p>
                  <button aria-label='Enter fullscreen mode'>Enter Fullscreen</button>
                </>
              : ''
          }
      </div>
    )
  }
}
