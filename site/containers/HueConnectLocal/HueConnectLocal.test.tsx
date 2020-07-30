
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { HueConnectLocal } from './HueConnectLocal'
import { PatternsStore } from '../../state/patternsStore'
import { ApiStatusStore } from '../../state/apiStatusStore'

describe(HueConnectLocal.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'You are already connected to your hue bridge.'

    const apiStatus: DeepPartial<ApiStatusStore> = {
      offline: false,
      localConnectionStatus: 'connected',
      connectLocal: () => Promise.resolve(),
    }
    const patterns: DeepPartial<PatternsStore> = {
      currentPattern: 'chakras',
      patternData: {
        chakras: {
          description: expected,
        },
      },
    }
    useStoresSpy.mockReturnValue({ apiStatus, patterns })

    const mounted = render(<HueConnectLocal />)
    const el = mounted.getByTestId('hue-connect-local')

    expect(el).toHaveTextContent(expected)
  })
})
