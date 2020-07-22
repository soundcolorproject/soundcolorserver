
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { HueGroupSelector } from './HueGroupSelector'
import { PatternsStore } from '../../state/patternsStore'

describe(HueGroupSelector.name, () => {
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

    const mounted = render(<HueGroupSelector />)
    const el = mounted.getByTestId('hue-group-selector')

    expect(el).toHaveTextContent(expected)
  })
})
