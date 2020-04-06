
import * as React from 'react'
import { Router, Redirect } from '@reach/router'
import { RootRoute } from './root'
import { InfoRoute } from './info'

export class AppRouter extends React.Component {
  render () {
    return (
      <Router>
        <RootRoute path='/' />
        <InfoRoute path='/info' />
        <Redirect default from='/*' to='/' />
      </Router>
    )
  }
}
