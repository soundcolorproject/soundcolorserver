
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { CustomPatternSelector } from './CustomPatternSelector'
import { PatternsStore } from '../../state/patternsStore'

describe(CustomPatternSelector.name, () => {
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

    const mounted = render(<CustomPatternSelector />)
    const el = mounted.getByTestId('custom-pattern-selector')

    expect(el).toHaveTextContent(expected)
  })
})
