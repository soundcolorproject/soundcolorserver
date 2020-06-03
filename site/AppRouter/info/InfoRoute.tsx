
import * as React from 'react'
import { Link, RouteComponentProps, navigate } from '@reach/router'

import { PatternBar } from '../../containers/PatternBar'
import { Logo } from '../../components/Logo/Logo'
import { injectAndObserve } from '../../state/injectAndObserve'
import { PatternName, PatternsProp } from '../../state/patternsStore'
import { RenderStateProp, togglePattern } from '../../state/renderStateStore'

import {
  infoBody,
  nav,
  header,
  colorPattern,
  patternTitle,
  patternHighlight,
  patternDescription,
  section,
  divider,
  origins,
  footer,
} from './info.pcss'
import { Feedback } from '../../containers/Feedback'

export interface OwnProps extends RouteComponentProps {
}

type StateProps = PatternsProp & RenderStateProp

export type InfoRouteProps = OwnProps & StateProps

const patterns: PatternName[] = [
  'chromesthesia',
  'chakras',
  'emotion',
  'chromotherapy',
  'adolescence',
  'custom',
]

const patternColors = {
  chromesthesia: '#E1BF5C',
  chakras: '#9D32F5',
  emotion: '#0E74D9',
  chromotherapy: '#E37081',
  adolescence: '#19BDA2',
  custom: '#EED0C6',
}

export const InfoRoute = injectAndObserve<StateProps, OwnProps>(
  ({ patterns, renderState }) => ({ patterns, renderState }),
  class InfoRoute extends React.Component<InfoRouteProps> {
    setPattern = (newPattern: PatternName) => () => {
      const { patterns, renderState } = this.props
      patterns.currentPattern = newPattern
      if (!renderState.showColors) {
        togglePattern(patterns, renderState)
      }
      navigate('/').catch()
    }

    renderPattern = (name: PatternName) => {
      const pattern = this.props.patterns.patternData[name]
      return (
        <div key={name} className={colorPattern}>
          <div className={patternTitle}>
            <div className={patternHighlight} style={{ background: patternColors[name] }} />
            <span>Color Pattern</span>
            <p>{pattern.label}</p>
          </div>
          <div className={patternDescription}>
            <PatternBar patternName={name} />
            <p>{pattern.description}</p>
            <button type='button' onClick={this.setPattern(name)}>Start with {pattern.label}</button>
          </div>
        </div>
      )
    }

    render () {
      return (
        <div className={infoBody}>

          <div className={nav}>
            <Logo />
            <Link to='/' className='gt-mobile'>Try the Sound Color System</Link>
            <Link to='/' className='lt-mobile'>Try It Now</Link>
          </div>

          <div className={header}>
            <h1>Exploring accessibility to sound through color, light, and texture.</h1>
            <h2>Offering an opportunity to experience the sound spectrum visually.</h2>
          </div>

          {
            patterns.map(this.renderPattern)
          }

          <div className={section}>
            <h1>Build with Sound Color Project</h1>
            <div className={divider}></div>
            <h2>We offer various builds of our software to be installed and used on different devices. (Coming soon)</h2>
            <a href='https://github.com/soundcolorproject/soundcolorserver' target='_blank'>
              <svg width='16' height='16' viewBox='0 0 16 16'>
                <g clipPath='url(#clip0)'>
                  <path fillRule='evenodd' clipRule='evenodd' d='M8 0.198853C3.58011 0.198853 0 3.77896 0 8.19885C0 11.7348 2.29343 14.7305 5.47084 15.7912C5.86863 15.8649 6.01596 15.6194 6.01596 15.4033C6.01596 15.2117 6.01105 14.7108 6.00614 14.0429C3.78146 14.5242 3.31001 12.9723 3.31001 12.9723C2.94659 12.0491 2.42112 11.7986 2.42112 11.7986C1.69429 11.3026 2.47514 11.3124 2.47514 11.3124C3.27563 11.3714 3.70288 12.1375 3.70288 12.1375C4.41498 13.3603 5.57397 13.0067 6.03069 12.8004C6.10436 12.2848 6.31062 11.9312 6.53653 11.7299C4.76366 11.5334 2.89748 10.8459 2.89748 7.78142C2.89748 6.90726 3.20688 6.19517 3.72253 5.63532C3.63904 5.42905 3.36403 4.61874 3.79619 3.51868C3.79619 3.51868 4.469 3.3026 5.99632 4.33882C6.63474 4.16202 7.31737 4.07362 8 4.06871C8.67772 4.07362 9.36525 4.16202 10.0037 4.33882C11.531 3.3026 12.2038 3.51868 12.2038 3.51868C12.6409 4.61874 12.3659 5.43397 12.2824 5.63532C12.7931 6.19517 13.1025 6.90726 13.1025 7.78142C13.1025 10.8557 11.2314 11.5285 9.44874 11.7299C9.73358 11.9754 9.99386 12.4665 9.99386 13.213C9.99386 14.2836 9.98404 15.143 9.98404 15.4082C9.98404 15.6243 10.1265 15.8698 10.5341 15.7912C13.7115 14.7305 16 11.7348 16 8.20376C16 3.77896 12.4199 0.198853 8 0.198853Z' fill='#191717' />
                </g>
                <defs>
                  <clipPath id='clip0'>
                    <rect y='0.198853' width='16' height='15.6022' fill='white' />
                  </clipPath>
                </defs>
              </svg>
              Sound Color Project on GitHub
                </a>
          </div>

          <div className={section}>
            <h1>Work With Us</h1>
            <div className={divider}></div>
            <h2>We believe in the strength of community and lifting one another up in solidarity of inclusion for all.</h2>
            <h2>If you have a vision of how Sound Color Project could be used in your space, we would love to hear about it.</h2>
            <Feedback />
          </div>

          <div className={section}>
            <h1>Origins</h1>
            <div className={divider}></div>
            <div className={origins}>
              <h2>Sound Color Project began as a way to offer people who are D/deaf or hard of hearing an opportunity to experience the feeling of music.</h2>
              <h2>Like any form of art, there is not one defined interpretation, but an opportunity for each participant to visualize the music in their own way.</h2>
              <h2>Using a device microphone, audio interface, or MIDI controller, sound waves are converted to color, through the translation based on different color patterns. Brightness, tone, and vibrance of light change according to volume, note, and frequency and are then customizable along with transition speed and the ability to see all colors in monochromacy.</h2>
              <h2>The color patterns derive from research in how the audible spectrum translates to the visible spectrum through forms connecting to emotion, sprituality, and memory. Color is only visible with the presence of light. With different amounts of light and the dependence of surroundings, colors can appear differently. Since we all see these colors differently, an option to create a custom color pattern is made available.</h2>
            </div>
          </div>

          <div className={footer}>
            <p>Sound Color Project © {new Date().getFullYear()}</p>
          </div>

        </div>
      )
    }
  },
)
