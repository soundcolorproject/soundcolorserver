
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { HueConnectLocal } from './HueConnectLocal'
import { PatternsStore } from '../../state/patternsStore'

describe(HueConnectLocal.name, () => {
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

    const mounted = render(<HueConnectLocal />)
    const el = mounted.getByTestId('hue-connect-local')

    expect(el).toHaveTextContent(expected)
  })
})
