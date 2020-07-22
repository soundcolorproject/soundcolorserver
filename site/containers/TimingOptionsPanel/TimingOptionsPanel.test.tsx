
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { TimingOptionsPanel } from './TimingOptionsPanel'
import { PatternsStore } from '../../state/patternsStore'

describe(TimingOptionsPanel.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Chaky-Ras'

    const patterns: DeepPartial<PatternsStore> = {
      currentPattern: 'chakras',
      patternData: {
        chakras: {
          description: expected,
        },
      },
    }
    useStoresSpy.mockReturnValue({ patterns })

    const mounted = render(<TimingOptionsPanel />)
    const el = mounted.getByTestId('timing-options-panel')

    expect(el).toHaveTextContent(expected)
  })
})
