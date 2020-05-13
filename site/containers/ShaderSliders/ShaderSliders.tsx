
import * as React from 'react'
import { action } from 'mobx'

import { ClickableMenuOption } from '../../components/MenuOption'
import { OverUnder } from '../../components/OverUnder'
import { shaderInfo } from '../ShaderCanvas'
import { BackOption } from '../BackOption'

import { injectAndObserve } from '../../state/injectAndObserve'
import { RenderStateProp } from '../../state/renderStateStore'
import { RoutingProp } from '../../state/routingStore'

import { sliders, content } from './shaderSliders.pcss'
import { Slider } from '../../components/Slider'

interface OwnProps {
  height?: number
  domRef?: React.Ref<HTMLDivElement>
}

type StateProps =
  & RenderStateProp
  & RoutingProp

export type ShaderSlidersProp = OwnProps & StateProps

export const ShaderSliders = injectAndObserve<StateProps, OwnProps>(
  ({ renderState, routing }) => ({ renderState, routing }),
  class ShaderSliders extends React.Component<ShaderSlidersProp> {
    private _setters: {
      [key: string]: (val: number) => void
    } = {}

    setValue = (name: string) => {
      if (!this._setters[name]) {
        const func = (value: number) => {
          this.props.renderState.shaderSliders[name] = value
        }
        this._setters[name] = action(`set:${name}`, func)
      }

      return this._setters[name]
    }

    renderSlider = (name: string) => {
      const { renderState: { shader, shaderSliders } } = this.props
      const info = shaderInfo[shader]
      const { label, defaultValue, min, max, step } = info.sliders![name]
      let { [name]: currentValue = defaultValue } = shaderSliders

      return (
        <Slider
          label={label}
          value={currentValue}
          min={min}
          max={max}
          step={step}
          onChange={this.setValue(name)}
        />
      )
    }

    goToShaderSelection = () => {
      this.props.routing.goToSubroute('shaderSelector')
    }

    render () {
      const {
        domRef,
        renderState: {
          shader,
        },
      } = this.props
      const info = shaderInfo[shader]

      return (
        <div ref={domRef} className={sliders}>
          <BackOption name='Shader' />
          <ClickableMenuOption onClick={this.goToShaderSelection} icon='arrow_forward'>
            <OverUnder
              over='Select Shader'
              under={info.label}
            />
          </ClickableMenuOption>
          {
            info.sliders && (
              <div className={content}>
                {
                  Object.keys(info.sliders).map(this.renderSlider)
                }
              </div>
            )
          }
        </div>
      )
    }
  },
)
