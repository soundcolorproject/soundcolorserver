
import { render } from '@testing-library/react'
import * as React from 'react'

import { mockUseStores } from '../../state/mockUseStores'
import { PatternsStore } from '../../state/patternsStore'

import { TimingOptionsPanel } from './TimingOptionsPanel'

describe(TimingOptionsPanel.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Color Transition Speed0.5'

    const patterns: DeepPartial<PatternsStore> = {
      transitionSpeed: 0.55,
      timeSmoothing: 0.5,
    }
    useStoresSpy.mockReturnValue({ patterns })

    const mounted = render(<TimingOptionsPanel />)
    const el = mounted.getByTestId('timing-options-panel-slider-transitionSpeed')

    expect(el).toHaveTextContent(expected)
  })
})
