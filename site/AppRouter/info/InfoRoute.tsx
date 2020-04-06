
import * as React from 'react'
import { Link, RouteComponentProps } from '@reach/router'

import { infoBody } from './info.pcss'

export interface InfoRouteProps extends RouteComponentProps {
}

export class InfoRoute extends React.Component<InfoRouteProps> {
  render () {
    return (
      <div id={infoBody}>
        <h1>SoundColor</h1>
        <br />
        <Link aria-label='Go to Color System' to='/'>Go to Color System</Link>
        <br />
        <h2>About</h2>
        <p>Supersonicas is an exploration to enable accessibility to sound through light and color, particularly for people experiencing hearing impairment. Like any form of art, there is not one defined interpretation, but an opportunity for each participant to experience new or familiar feeling in their own way. The color, brightness, tone, and vibrance of light change according to color pattern, volume, scale, and frequency.</p>
        <p>The color patterns created are inspired by research conducted around chromesthesia, chakras, chromotherapy, emotion, adolescence. They are then considered what the pattern might look like through the eyes of those who experience total color blindness.</p>
        <p><strong>Chromesthesia</strong></p>
        <p>Also known as sound-color synesthesia, this pattern is based on phenomenon in which those who experience it (less than 1 in every 2,000 people) hear sounds and see colors. It has been described as a sort of 'film of color' in front of ones field of vision. Typically, those who experience chromesthesia also have perfect pitch, meaning they can hear a note audibly, and know exactly what note that is. This is likely because they know what color represents every note.</p>
        <p><strong>Chakras</strong></p>
        <p>Referencing the points of the energy in the body, they are often used to find spiritual or concious balance through meditation. Each chakra — root, sacral, solar plexus, heart, throat, third eye, and crown — are represented by the colors of the rainbow, starting at the bottom (root) of the body with red to the top (crown) with violet. Every chakra, or energy in the body, is also in tune with a specific frequency or note, commonly connected to through instruments like singing bowls. The spectrum of color in the rainbow depicts the order in the body in which we are to return through the practice of attention on the inner self.</p>
        <p><strong>Chromotherapy</strong></p>
        <p>Through early research and calculations around chromotherapy, Dinshah Ghadiali experimented exposing colored light to people as a form of healing. Using the measurement of electromagnetic waves, the visible spectrum can be converted to sound waves, causing colors to correspond to closely relating notes.</p>
        <p><strong>Emotion</strong></p>
        <p>Using Robert Plutchik's emotion wheel, colors are directly related to human emotions. In a similar way different genres of music often portray the same emotions. By looking at what genres commonly evoke certain emotions, and seeing what are the most frequently used notes and keys in those genres, the colors on the emotion wheel can roughly coorelate to musical notes.</p>
        <p><strong>Adolescence</strong></p>
        <p>Often a form of developing chromesthesia, children are introduced to a variety of colors and musical sounds at the same time. From pianos and xylophones, to light up sound-making toys, toddlers are exposed and begin to relate musical notes to colors while learning and creating coorelations between the two from the earliest of developmental phases.</p>
        <h2>Contact</h2>
        <p>To learn more about the Sound Color Project, please reach out to Derek Torsani at <a href='mailto:derektorsani@gmail.com'>derektorsani@gmail.com</a>.</p>
      </div>
    )
  }
}
