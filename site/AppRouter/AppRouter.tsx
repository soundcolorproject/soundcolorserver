
import * as React from 'react'
import { Router, Redirect } from '@reach/router'
import { RootRoute } from './root'
import { InfoRoute } from './info'
import { ColorRenderer } from '../containers/ColorRenderer'

export class AppRouter extends React.Component {
  render () {
    return (
      <div>
        <Router>
          <RootRoute path='/' />
          <InfoRoute path='/info' />
          <Redirect default from='/*' to='/' />
        </Router>
      </div>
    )
  }
}
