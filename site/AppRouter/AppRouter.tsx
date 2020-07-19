
import * as React from 'react'
import { Router, Redirect } from '@reach/router'
import { SovisRoute } from './sovis'
import { InfoRoute } from './info'

export class AppRouter extends React.Component {
  render () {
    return (
      <div>
        <Router>
          <InfoRoute path='/' />
          <SovisRoute path='/sovis' />
          <Redirect default from='/*' to='/' />
        </Router>
      </div>
    )
  }
}
