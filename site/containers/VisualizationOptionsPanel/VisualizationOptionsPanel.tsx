
import * as React from 'react'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'

import { visualizationOptionsPanel } from './visualizationOptionsPanel.pcss'
import { Panel } from '../../components/Panel'
import { shaderInfo } from '../ShaderCanvas/shaderName'
import { Slider } from '../../components/Slider'

export interface VisualizationOptionsPanelProps extends RouteComponentProps {
  'data-testid'?: string
}

export const VisualizationOptionsPanel: React.FunctionComponent<VisualizationOptionsPanelProps> = function VisualizationOptionsPanel (props: VisualizationOptionsPanelProps) {
  const {
    'data-testid': testid = 'visualization-options-panel',
  } = props
  const { renderState } = useStores()

  const setValue = (name: string) => (value: number) => {
    renderState.shaderSliders[name] = value
  }

  const renderSlider = (name: string) => {
    const { shader, shaderSliders } = renderState
    const info = shaderInfo[shader]
    const { label, defaultValue, min, max, step } = info.sliders![name]
    let { [name]: currentValue = defaultValue } = shaderSliders

    return (
      <Slider
        key={name}
        label={label}
        value={currentValue}
        min={min}
        max={max}
        step={step}
        onChange={setValue(name)}
        data-testid={`${testid}-slider-${name}`}
      />
    )
  }

  return useObserver(() => {
    const info = shaderInfo[renderState.shader]
    return (
      <Panel title='Visualization' className={visualizationOptionsPanel} data-testid={testid}>
      {
        info.sliders && Object.keys(info.sliders).map(renderSlider)
      }
      </Panel>
    )
  })
}
