
import { Link } from '@reach/router'
import * as React from 'react'

import { logger } from '../../../../../shared/logger'
import { LinkButton } from '../../../../components/LinkButton'
import { Logo } from '../../../../components/Logo'
import { PatreonLink } from '../../../../components/PatreonLink'

import headerBackdropImage from './header-backdrop.png'
import headerBackdropVideo from './header.webm'
import {
  buttons,
  header,
  headerBackdrop,
  headerPadding,
  headerText,
  infoHeader,
  logo,
  logoWrapper,
  nav,
} from './infoHeader.pcss'

export function InfoHeader () {
  const [showVideo, setShowVideo] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const videoLoaded = React.useCallback((ev: React.SyntheticEvent<HTMLVideoElement>) => {
    ev.currentTarget.play().then(() => {
      setShowVideo(true)
    }).catch(() => {
      logger.warn('failed to start video')
    })
  }, [])

  return (
    <div className={infoHeader}>
      <div className={headerBackdrop}>
        <video hidden={!showVideo} ref={videoRef} muted loop onCanPlayThrough={videoLoaded}>
          <source src={headerBackdropVideo} />
        </video>
        <img hidden={showVideo} src={headerBackdropImage} />
      </div>
      <div className={headerPadding}>
          <div className={nav}>
            <Link to='/' className={logoWrapper}>
              <Logo className={logo} />
              <span className='gt-minitab'>Sound Color Project</span>
            </Link>
            <div className={buttons}>
              <PatreonLink className='gt-mobile' />
              <LinkButton to='/sovis' >Explore SOVIS</LinkButton>
            </div>
          </div>

          <div className={header}>
          <h1 className={headerText}>Exploring the relationships between audible and visual spectrums.</h1>
          </div>
      </div>
    </div>
  )
}
