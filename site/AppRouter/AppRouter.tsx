
import * as React from 'react'
import { Router, Redirect } from '@reach/router'
import { SovisRoute } from './sovis'
import { InfoRoute } from './info'
import { ConnectHueRoute } from './connect-hue'

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
