
import { RouteComponentProps } from '@reach/router'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { Checkbox } from '../../components/Checkbox'
import { Panel } from '../../components/Panel'
import { Slider } from '../../components/Slider'
import { useStores } from '../../state/useStores'

import { colorOptionsPanel } from './colorOptionsPanel.pcss'

export interface ColorOptionsPanelProps extends RouteComponentProps {
  'data-testid'?: string
}

type SliderName =
  | 'vibranceMultiplier'
  | 'noiseMultiplier'
  | 'minimumBrightness'

interface SliderInfo {
  label: string
  min: number
  max: number
  step?: number
  mapper?: (val: number) => number
  unMapper?: (val: number) => number
}

const SLIDER_INFO: { [name in SliderName]: SliderInfo } = {
  vibranceMultiplier: {
    label: 'Vibrance',
    min: 0,
    max: 5,
  },
  noiseMultiplier: {
    label: 'Saturation',
    min: 0,
    max: 10,
    mapper: (v) => 10 - v,
    unMapper: (v) => 10 - v,
  },
  minimumBrightness: {
    label: 'Minimum Brightness',
    min: 0,
    max: 1,
  },
}

const SLIDER_NAMES = Object.keys(SLIDER_INFO) as SliderName[]
const ident = (v: number) => v
export const ColorOptionsPanel: React.FunctionComponent<ColorOptionsPanelProps> = function ColorOptionsPanel (props: ColorOptionsPanelProps) {
  const {
    'data-testid': testid = 'color-options-panel',
  } = props
  const { patterns } = useStores()

  const setValue = (name: SliderName) => React.useCallback((value: number) => {
    const { mapper = ident } = SLIDER_INFO[name]
    patterns[name] = mapper(value)
  }, [patterns])

  const setMonochrome = React.useCallback((value: boolean) => {
    patterns.monochrome = value
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
        data-testid={`${testid}-slider-${name}`}
      />
    )
  }

  return useObserver(() => (
    <Panel title='Color' className={colorOptionsPanel} data-testid={testid}>
      {SLIDER_NAMES.map(renderSlider)}
      <Checkbox
        label='Monochromacy'
        checked={patterns.monochrome}
        onChange={setMonochrome}
      />
    </Panel>
  ))
}
