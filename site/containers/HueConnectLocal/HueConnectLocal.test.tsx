
import { render } from '@testing-library/react'
import * as React from 'react'

import { ApiStatusStore } from '../../state/apiStatusStore'
import { mockUseStores } from '../../state/mockUseStores'
import { PatternsStore } from '../../state/patternsStore'

import { HueConnectLocal } from './HueConnectLocal'

describe(HueConnectLocal.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'You are already connected to your Hue Bridge.'

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
