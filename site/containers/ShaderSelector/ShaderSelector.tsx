
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { RenderStateProp } from '../../state/renderStateStore'
import { RoutingProp } from '../../state/routingStore'

import { MenuOption, ClickableMenuOption } from '../../components/MenuOption'

import { BackOption } from '../BackOption'
import { ShaderName, shaderNames, shaderInfo } from '../ShaderCanvas'

import { shaderSelector } from './shaderSelector.pcss'

interface OwnProps {
}

type StateProps = RenderStateProp & RoutingProp

export type ShaderSelectorProps = OwnProps & StateProps

export const ShaderSelector = injectAndObserve<StateProps, OwnProps>(
  ({ renderState, routing }) => ({ renderState, routing }),
  class ShaderSelector extends React.Component<ShaderSelectorProps> {
    onClick = (shader: ShaderName) => () => {
      const { renderState, routing } = this.props
      renderState.shader = shader
      routing.popSubroute()
    }

    renderContent = () => {
      return (
        <>
          {
            shaderNames.map(shader => (
              <ClickableMenuOption key={shader} onClick={this.onClick(shader)}>
                {shaderInfo[shader].label}
              </ClickableMenuOption>
            ))
          }
        </>
      )
    }

    render () {
      return (
        <div className={shaderSelector}>
          <BackOption name='Select Shader' />
          {this.renderContent()}
        </div>
      )
    }
  },
)
