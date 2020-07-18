
import * as React from 'react'
import { Router, Redirect } from '@reach/router'
import { RootRoute } from './root'
import { InfoRoute } from './info'

export class AppRouter extends React.Component {
  render () {
    return (
      <div>
        <Router>
          <InfoRoute path='/' />
          <RootRoute path='/sovis' />
          <Redirect default from='/*' to='/' />
        </Router>
      </div>
    )
  }
}
