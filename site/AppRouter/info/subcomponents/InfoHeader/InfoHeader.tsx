
import * as React from 'react'
import { Link } from '@reach/router'

import { Logo } from '../../../../components/Logo'
import {
  infoHeader,
  headerBackdrop,
  headerPadding,
  nav,
  logoWrapper,
  logo,
  buttons,
  headerText,
  header,
} from './infoHeader.pcss'

import { LinkButton } from '../LinkButton'
import headerBackdropImage from './header-backdrop.png'
import { PatreonLink } from '../../../../components/PatreonLink'

export function InfoHeader () {
  return (
    <div className={infoHeader}>
      <div className={headerBackdrop}>
          <img src={headerBackdropImage} />
      </div>
      <div className={headerPadding}>
          <div className={nav}>
            <Link to='/' className={logoWrapper}>
              <Logo className={logo} />
              <span className='gt-minitab'>Sound Color Project</span>
            </Link>
            <div className={buttons}>
              <PatreonLink className='gt-mobile' />
              <LinkButton to='/' >Explore SOVIS</LinkButton>
            </div>
          </div>

          <div className={header}>
          <h1 className={headerText}>Exploring the relationships between audible and visual spectrums.</h1>
          </div>
      </div>
    </div>
  )
}
