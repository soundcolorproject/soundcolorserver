
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { SavedPaletteSelector } from './SavedPaletteSelector'
import { PatternsStore } from '../../state/patternsStore'

describe(SavedPaletteSelector.name, () => {
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

    const mounted = render(<SavedPaletteSelector />)
    const el = mounted.getByTestId('saved-palette-selector')

    expect(el).toHaveTextContent(expected)
  })
})
