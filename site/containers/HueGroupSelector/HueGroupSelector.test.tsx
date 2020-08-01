
import { render } from '@testing-library/react'
import * as React from 'react'

import { ApiStatusStore } from '../../state/apiStatusStore'
import { mockUseStores } from '../../state/mockUseStores'
import { PatternsStore } from '../../state/patternsStore'
import { RoutingStore } from '../../state/routingStore'

import { HueGroupSelector } from './HueGroupSelector'

describe(HueGroupSelector.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'No light groups found'

    const apiStatus: DeepPartial<ApiStatusStore> = {
      lightGroups: [],
    }
    const routing: DeepPartial<RoutingStore> = {
    }
    useStoresSpy.mockReturnValue({ apiStatus, routing })

    const mounted = render(<HueGroupSelector />)
    const el = mounted.getByTestId('hue-group-selector')

    expect(el).toHaveTextContent(expected)
  })
})
