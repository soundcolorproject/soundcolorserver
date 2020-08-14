
import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'

import { LinkButton } from '../../components/LinkButton'
import { PatreonLink } from '../../components/PatreonLink'
import { PatternName } from '../../state/patternsStore'
import { useStores } from '../../state/useStores'

import hirshhornLogo from './hirshhorn.svg'
import { footer, infoBody, link, linkWrapper, list, subsection } from './info.pcss'
import sequoiaLogo from './sequoia.svg'
import { InfoHeader } from './subcomponents/InfoHeader'
import { InfoSection } from './subcomponents/InfoSection'
import { PatternInfo } from './subcomponents/PatternInfo'

export interface OwnProps extends RouteComponentProps {
}

const patternNames: PatternName[] = [
  'chromesthesia',
  'chakras',
  'emotion',
  'chromotherapy',
  'adolescence',
  'custom',
]

export function InfoRoute (_props: OwnProps) {
  const { intro, patterns, renderState } = useStores()
  const { patternData } = patterns
  const setPattern = (newPattern: PatternName) => React.useCallback((ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (ev.metaKey || ev.ctrlKey) {
      ev.preventDefault()
    }

    intro.seenHowItWorks = true
    patterns.currentPattern = newPattern
    if (intro.warningAccepted) {
      renderState.startPattern(patterns)
    }

    navigate('/sovis').catch()
  }, [patterns, renderState])

  return (
    <div className={infoBody} data-testid='info-page'>
      <InfoHeader />

      <InfoSection
        title='about'
        spacerColor='#F6D70B'
      >
        <p>The Sound Color Project began as a way to find ways to provide accessibility to music through visual attributes such as light, color, and texture.</p>
        <p>As the project evolves, it continues to move forward with the mission of exploring multisensory accessibility.</p>
      </InfoSection>

      <InfoSection
        title='featured by'
        spacerColor='#40C0AD'
      >
        <p style={{ textAlign: 'center' }}><img src={hirshhornLogo} /></p>
        <p style={{ textAlign: 'center' }}><img src={sequoiaLogo} /></p>
      </InfoSection>

      <InfoSection
        title='how sovis works'
        spacerColor='#EC5F2D'
      >
        <p>The SOVIS product uses an audio input source — device microphone, USB audio interface — to analyze frequency and volume. Using a defined color pattern and mapping audible to visual attributes, the frequency and volume are translated into color, light, and texture.</p>
        <p>SOVIS is built on Javascript and utilizes the Web Audio API.  It never stores or transmits audio, but simply uses it to drive the color patterns seen on screen.</p>
        <p>SOVIS can be installed as an app.  This will add an app icon on your home screen if on mobile, or create a browser-based application on a laptop or desktop.</p>
        {/* <p>There is an available executable for developers called SOVIS for Desktop.</p> */}
      </InfoSection>

      <InfoSection
        title='color patterns'
        spacerColor='#9D32F5'
      >
        <p>Thorough research has helped us define a variety of ways to translate a sonic element into a visual one.</p>
        {
          patternNames.map(name => (
            <PatternInfo
              key={name}
              isCustom={name === 'custom'}
              pattern={patternData[name]}
              setPattern={setPattern(name)}
            />
          ))
        }
      </InfoSection>

      <InfoSection
        title='features'
        spacerColor='#40C070'
      >
        <div className={subsection}>
          <h3>Philips Hue</h3>
          Easily connect your Philips Hue lights to experience SOVIS in your space.
        </div>
        <div className={subsection}>
          <h3>Audio Inputs</h3>
          Use your device microphone, USB microphone, or USB audio interface as a source for audio input.
        </div>
        <div className={subsection}>
          <h3>Sound Details</h3>
          Receive instant detailed feedback on your audio input including noise volume, tone volume, frequency, note, and cents flat.
        </div>
        <div className={subsection}>
          <h3>Fine Tune</h3>
          Customize your visual experience with color, brightness, vibrance, texture, and more.
        </div>
        <div className={subsection}>
          <h3>Keyboard Shortcuts</h3>
          Navigate SOVIS with keyboard shortcuts to enable full screen display and quick customization.
        </div>

        <div className={subsection} style={{ textAlign: 'center' }}>
          <LinkButton to='/sovis' color='#1B2128'>Explore SOVIS</LinkButton>
        </div>
      </InfoSection>

      <InfoSection
        title='flexible &amp; divrese'
        spacerColor='#F6AB0B'
      >
        <p>SOVIS can be displayed on your phone, computer monitor, TV, projector, and Philips Hue lights, making it easy to use for many applications.</p>
        <ul className={list}>
          <li>Music Performances</li>
          <li>Yoga &amp; Meditative Practices</li>
          <li>Chromotherapy Healing</li>
          <li>Speech Visualization</li>
          <li>Sound-to-Color Synesthesia Representation</li>
        </ul>
      </InfoSection>

      <InfoSection
        title='support'
        spacerColor='#EC5F2D'
      >
        <p>For us, Sound Color Project is an experiment to make something new that challenges accessibility to feeling. We’re passionate about doing this, which means we put our own resources and plenty of effort into building something to share with the world.</p>
        <p>To support us and this project, you can become a patron, which helps encourage us to keep going, knowing this means something to someone else too.</p>
        <div className={linkWrapper}>
          <PatreonLink />
        </div>
      </InfoSection>

      <InfoSection
        title='troubleshooting'
        spacerColor='#EC472D'
      >
        <div className={subsection}>
          <h3>Getting Started</h3>
          To get started, launch SOVIS. If prompted by your browser, allow access to the device microphone. Hit play or select a color pattern. Then make noise and watch the colors and light change accordingly.
        </div>
        <div className={subsection}>
          <h3>Mic Access</h3>
          In order to make SOVIS work, you need to allow mic access via your browser. When you pause the system or use a different audio input source, the mic stops listening. Nothing is ever recorded or stored.
        </div>
        <div className={subsection}>
          <h3>Browser Compatability</h3>
          SOVIS only works in Chrome, Firefox, Brave, and all Chromium based browsers.
        </div>
        <div className={subsection}>
          <h3>Updating Browser</h3>
          If SOVIS is not working after allowing mic access in a Chromium based browser, please check to make sure your browser is updated to its latest version.
        </div>
      </InfoSection>

      <InfoSection
        title='contact'
        spacerColor='#204ADA'
      >
        <p>The Sound Color Project is made by <a className={link} href='https://kgroat.dev' target='_blank'>Kevin Groat</a> and <a className={link} href='https://derektorsani.com/' target='_blank'>Derek Torsani</a>.</p>
        <p>For any questions, issues, or ideas, please reach out to us.</p>
        <div className={subsection} />
        <div className={subsection}>
          <h3>Email</h3>
          <a className={link} href='mailto:info@soundcolorproject.com'>info@soundcolorproject.com</a>
        </div>
      </InfoSection>

      <div className={footer}>
        <div>Sound Color Project © {new Date().getFullYear()}</div>
        <div><a className={link} href='/privacy'>Privacy</a> / <a className={link} href='/cookies'>Cookies</a></div>
      </div>
    </div>
  )
}
