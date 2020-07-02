
import * as React from 'react'
import { Router, Redirect } from '@reach/router'
import { RootRoute } from './root'
import { InfoRoute } from './info'
import { ColorRenderer } from '../containers/ColorRenderer'

export class AppRouter extends React.Component {
  // TODO make info be at `/` and sovis be at `/sovis`
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
