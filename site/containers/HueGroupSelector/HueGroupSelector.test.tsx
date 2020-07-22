
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { HueGroupSelector } from './HueGroupSelector'
import { PatternsStore } from '../../state/patternsStore'
import { ApiStatusStore } from '../../state/apiStatusStore'
import { RoutingStore } from '../../state/routingStore'

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
