
import { render } from '@testing-library/react'
import * as React from 'react'

import { mockUseStores } from '../../state/mockUseStores'
import { PatternsStore } from '../../state/patternsStore'
import { RenderStateStore } from '../../state/renderStateStore'

import { ActionsPanel } from './ActionsPanel'

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
