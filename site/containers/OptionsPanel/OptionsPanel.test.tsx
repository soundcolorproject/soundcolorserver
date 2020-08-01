
import { render } from '@testing-library/react'
import * as React from 'react'

import { mockUseStores } from '../../state/mockUseStores'
import { PatternsStore } from '../../state/patternsStore'

import { OptionsPanel } from './OptionsPanel'

describe(OptionsPanel.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Color'

    useStoresSpy.mockReturnValue({})

    const mounted = render(<OptionsPanel />)
    const el = mounted.getByTestId('options-panel-color-button')

    expect(el).toHaveTextContent(expected)
  })
})
