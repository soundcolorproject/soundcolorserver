
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
    const expected = 'My Custom Palette'

    const patterns: DeepPartial<PatternsStore> = {
      favorites: {
        [expected]: {},
      },
    }
    useStoresSpy.mockReturnValue({ patterns })

    const mounted = render(<SavedPaletteSelector />)
    const el = mounted.getByTestId('saved-palette-selector-palette-button-0')

    expect(el).toHaveTextContent(expected)
  })
})
