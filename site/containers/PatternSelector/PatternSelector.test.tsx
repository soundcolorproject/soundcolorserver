
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'
import { PatternsStore } from '../../state/patternsStore'
import { HSVa } from '../../pcss-functions/toHsv'

import { PatternSelector } from './PatternSelector'

describe(PatternSelector.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Chaky-Ras'

    const patterns: DeepPartial<PatternsStore> = {
      currentPattern: 'chakras',
      patternNames: ['chakras'],
      patternData: {
        chakras: {
          label: expected,
          buttonNoteColor: 'C',
          colors: {
            'C': new HSVa(120, 1, 1),
          },
        },
      },
      favorites: {},
    }
    useStoresSpy.mockReturnValue({ patterns })

    const mounted = render(<PatternSelector />)
    const el = mounted.getByTestId('pattern-button-chakras')

    expect(el).toHaveTextContent(expected)
  })
})
