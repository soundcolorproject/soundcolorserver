
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { ActionsPanel } from './ActionsPanel'
import { PatternsStore } from '../../state/patternsStore'
import { RenderStateStore } from '../../state/renderStateStore'

describe(ActionsPanel.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Install SOVIS App'

    const renderState: DeepPartial<RenderStateStore> = {
      showColors: false,
    }
    useStoresSpy.mockReturnValue({ renderState })

    const mounted = render(<ActionsPanel />)
    const el = mounted.getByTestId('actions-panel-install-button')

    expect(el).toHaveTextContent(expected)
  })
})
