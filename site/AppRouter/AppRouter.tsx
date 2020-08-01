
import { Redirect, Router } from '@reach/router'
import * as React from 'react'

import { ConnectHueRoute } from './connect-hue'
import { InfoRoute } from './info'
import { SovisRoute } from './sovis'

export class AppRouter extends React.Component {
  render () {
    return (
      <div>
        <Router>
          <InfoRoute path='/' />
          <SovisRoute path='/sovis' />
          <ConnectHueRoute path='/return-from-hue' />
          <Redirect default from='/*' to='/' />
        </Router>
      </div>
    )
  }
}
