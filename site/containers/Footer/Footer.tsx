
import * as React from 'react'

import { footer, footerItem } from './footer.pcss'

export class Footer extends React.Component {
  render () {
    const { children } = this.props
    return (
      <div id={footer}>
        {
          React.Children.map(children, (child, idx) => (
            <div key={idx} className={footerItem}>{child}</div>
          ))
        }
      </div>
    )
  }
}
