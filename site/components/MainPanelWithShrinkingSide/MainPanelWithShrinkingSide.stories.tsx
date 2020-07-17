
import * as React from 'react'

import { MainPanelWithShrinkingSide, TransitionDirection } from './MainPanelWithShrinkingSide'
import { ShrinkingSidePanel } from '../ShrinkingSidePanel'
import { ShrinkingPanelButton } from '../ShrinkingPanelButton'
import { IconName } from '../Icon'

export default {
  title: 'MainPanelWithShrinkingSide',
}

interface PanelDetail {
  title: string
  icon: IconName
}
type PanelName = 'home' | 'colors' | 'connections' | 'options' | 'sound' | 'actions'
const panels: PanelName[] = ['colors', 'connections', 'options', 'sound', 'actions']
const panelDetails: Record<PanelName, PanelDetail> = {
  home: {
    title: 'Sound Color Project',
    icon: 'logo',
  },
  colors: {
    title: 'Color Patterns',
    icon: 'colors',
  },
  connections: {
    title: 'Connections',
    icon: 'connections',
  },
  options: {
    title: 'Options',
    icon: 'tune',
  },
  sound: {
    title: 'Sound Details',
    icon: 'music_note',
  },
  actions: {
    title: 'Actions',
    icon: 'download',
  },
}

function PanelContent ({ name }: { name: PanelName }) {
  return (
  <div style={{ paddingTop: 14, paddingLeft: 16, fontSize: 12 }}>{panelDetails[name].title}</div>
  )
}

function StatefulExample () {
  const [panel, setPanel] = React.useState<PanelName>('home')
  const [prevPanel, setPrevPanel] = React.useState<PanelName>('home')
  const [transitionDirecton, setTransitionDirection] = React.useState<TransitionDirection>('right')

  React.useLayoutEffect(() => {
    if (prevPanel === 'home') {
      setTransitionDirection('left')
    } else if (panels.indexOf(panel) > panels.indexOf(prevPanel)) {
      setTransitionDirection('down')
    } else {
      setTransitionDirection('up')
    }
    setPrevPanel(panel)
  }, [panel])

  const shrink = panel !== 'home'

  const changePanel = (name: PanelName) => () => setPanel(name)
  const sidePanel = () => (
    <ShrinkingSidePanel shrink={shrink}>
      <ShrinkingPanelButton
        icon={shrink ? 'arrow_back' : 'logo'}
        noArrow
        noBold
        shrink={shrink}
        active={panel === 'home'}
        onClick={changePanel('home')}
      >
        Sound Color Project
      </ShrinkingPanelButton>
      {
        panels.map(name => (
          <ShrinkingPanelButton
            key={name}
            icon={panelDetails[name].icon}
            shrink={shrink}
            active={panel === name}
            onClick={changePanel(name)}
          >
            {panelDetails[name].title}
          </ShrinkingPanelButton>
        ))
      }
    </ShrinkingSidePanel>
  )

  return (
    <MainPanelWithShrinkingSide
      sidePanel={sidePanel()}
      height={panel === 'colors' ? 384 : 288}
      transitionDirection={transitionDirecton}
      open={shrink}
    >
      {
        panel === 'home'
          ? null
          : <PanelContent key={panel} name={panel} />
      }
    </MainPanelWithShrinkingSide>
  )
}

export const statefulExample = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <StatefulExample />
    </div>
  )
}
