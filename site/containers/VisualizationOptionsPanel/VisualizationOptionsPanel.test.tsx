
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { VisualizationOptionsPanel } from './VisualizationOptionsPanel'
import { PatternsStore } from '../../state/patternsStore'
import { RenderStateStore } from '../../state/renderStateStore'

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
