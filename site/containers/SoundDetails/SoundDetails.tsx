
import { RouteComponentProps } from '@reach/router'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { ToneInfo } from '../../audio/getAnalysis'
import { Panel } from '../../components/Panel'
import { PanelDetail } from '../../components/PanelDetail'
import { useStores } from '../../state/useStores'

import { detailName, soundDetails } from './soundDetails.pcss'

export interface SoundDetailsProps extends RouteComponentProps {
  'data-testid'?: string
}

export const SoundDetails: React.FunctionComponent<SoundDetailsProps> = function SoundDetails (props: SoundDetailsProps) {
  const {
    'data-testid': testid = 'sound-details',
  } = props
  const { analysis } = useStores()

  const renderDetails = (info?: ToneInfo) => {
    const noiseVolume = info && analysis.noise ? `${analysis.noise.toFixed(2)} dB` : '•'
    const toneVolume = info ? `${info.dB.toFixed(0)} dB` : '•'
    const frequency = info ? `${info.frequency.toFixed(2)} hz` : '•'
    const note = info ? `${info.note.note} ${info.note.octave}` : '•'
    const cents = info ? `${info.note.cents.toFixed(2)}` : '•'

    return (
      <>
        <PanelDetail data-testid={`${testid}-noise`}>
          <span className={detailName}>Noise volume: </span>
          <span>{noiseVolume}</span>
        </PanelDetail>
        <PanelDetail data-testid={`${testid}-tone`}>
          <span className={detailName}>Primary Tone Volume: </span>
          <span>{toneVolume}</span>
        </PanelDetail>
        <PanelDetail data-testid={`${testid}-freq`}>
          <span className={detailName}>Primary Frequency: </span>
          <span>{frequency}</span>
        </PanelDetail>
        <PanelDetail data-testid={`${testid}-note`}>
          <span className={detailName}>Primary Note: </span>
          <span>{note}</span>
        </PanelDetail>
        <PanelDetail data-testid={`${testid}-cents`}>
          <span className={detailName}>Cents ♭: </span>
          <span>{cents}</span>
        </PanelDetail>
      </>
    )
  }

  return useObserver(() => (
    <Panel title='Sound Details' className={soundDetails} data-testid={testid}>
      {
        analysis.tones.length >= 1
          ? renderDetails(analysis.tones[0])
          : renderDetails()
      }
    </Panel>
  ))
}
