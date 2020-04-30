
import * as React from 'react'
import { Link, RouteComponentProps } from '@reach/router'

import {
  infoBody,
  patternName,
} from './info.pcss'

export interface InfoRouteProps extends RouteComponentProps {
}

export class InfoRoute extends React.Component<InfoRouteProps> {
  render () {
    return (
      <div className={infoBody}>
        <h1>SoundColor</h1>
        This is the info page!
        <p className={patternName}>Chromesthesia</p>
      </div>
    )
  }
}
