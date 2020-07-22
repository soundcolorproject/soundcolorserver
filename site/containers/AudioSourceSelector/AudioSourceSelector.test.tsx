
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { AudioSourceSelector } from './AudioSourceSelector'
import { PatternsStore } from '../../state/patternsStore'

describe(AudioSourceSelector.name, () => {
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

    const mounted = render(<AudioSourceSelector />)
    const el = mounted.getByTestId('audio-source-selector')

    expect(el).toHaveTextContent(expected)
  })
})
