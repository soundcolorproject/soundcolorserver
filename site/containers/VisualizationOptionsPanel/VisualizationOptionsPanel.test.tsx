
import { render } from '@testing-library/react'
import * as React from 'react'

import { mockUseStores } from '../../state/mockUseStores'
import { RenderStateStore } from '../../state/renderStateStore'

import { VisualizationOptionsPanel } from './VisualizationOptionsPanel'

describe(VisualizationOptionsPanel.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Spread0.33'

    const renderState: DeepPartial<RenderStateStore> = {
      shader: 'lights',
      shaderSliders: {},
    }
    useStoresSpy.mockReturnValue({ renderState })

    const mounted = render(<VisualizationOptionsPanel />)
    const el = mounted.getByTestId('visualization-options-panel-slider-u_diffusion')

    expect(el).toHaveTextContent(expected)
  })
})
