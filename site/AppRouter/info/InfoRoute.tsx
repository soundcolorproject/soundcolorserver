
import * as React from 'react'
import { Link, RouteComponentProps } from '@reach/router'

import {
  infoBody,
} from './info.pcss'

export interface InfoRouteProps extends RouteComponentProps {
}

export class InfoRoute extends React.Component<InfoRouteProps> {
  render () {
    return (
      <div className={infoBody}>
        <h1>Sound Color Project</h1>
        Coming soon.
      </div>
    )
  }
}
