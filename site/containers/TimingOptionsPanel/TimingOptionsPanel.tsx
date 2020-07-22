
import * as React from 'react'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'

import { timingOptionsPanel } from './timingOptionsPanel.pcss'
import { Slider } from '../../components/Slider'
import { Panel } from '../../components/Panel'

export interface TimingOptionsPanelProps extends RouteComponentProps {
  'data-testid'?: string
}

type SliderName =
  | 'transitionSpeed'
  | 'timeSmoothing'

interface SliderInfo {
  label: string
  min: number
  max: number
  step?: number
  mapper?: (val: number) => number
  unMapper?: (val: number) => number
}

const SLIDER_INFO: { [name in SliderName]: SliderInfo } = {
  transitionSpeed: {
    label: 'Color Transition Speed',
    min: 0.1,
    max: 1,
  },
  timeSmoothing: {
    label: 'Time Smoothing',
    min: 0,
    max: 0.99,
  },
}

const SLIDER_NAMES = Object.keys(SLIDER_INFO) as SliderName[]
const ident = (v: number) => v
export const TimingOptionsPanel: React.FunctionComponent<TimingOptionsPanelProps> = function TimingOptionsPanel (props: TimingOptionsPanelProps) {
  const {
    'data-testid': testid = 'timing-options-panel',
  } = props
  const { patterns } = useStores()

  const setValue = (name: SliderName) => React.useCallback((value: number) => {
    const { mapper = ident } = SLIDER_INFO[name]
    patterns[name] = mapper(value)
  }, [patterns])

  const renderSlider = (name: SliderName) => {
    const { unMapper = ident } = SLIDER_INFO[name]
    const value = unMapper(patterns[name])
    const { label, min, max, step } = SLIDER_INFO[name]

    return (
      <Slider
        key={name}
        label={label}
        value={value}
        onChange={setValue(name)}
        min={min}
        max={max}
        step={step}
      />
    )
  }
  return useObserver(() => (
    <Panel title='Timing' className={timingOptionsPanel} data-testid={testid}>
      {SLIDER_NAMES.map(renderSlider)}
    </Panel>
  ))
}
