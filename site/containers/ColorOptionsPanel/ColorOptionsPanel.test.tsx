
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { ColorOptionsPanel } from './ColorOptionsPanel'
import { PatternsStore } from '../../state/patternsStore'

describe(ColorOptionsPanel.name, () => {
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

    const mounted = render(<ColorOptionsPanel />)
    const el = mounted.getByTestId('color-options-panel')

    expect(el).toHaveTextContent(expected)
  })
})
