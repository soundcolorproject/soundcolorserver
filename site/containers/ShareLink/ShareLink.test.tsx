
import { render } from '@testing-library/react'
import * as React from 'react'

import { mockUseStores } from '../../state/mockUseStores'
import { RoutingStore } from '../../state/routingStore'

import { ShareLink } from './ShareLink'

describe(ShareLink.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Share Sound Color Project'

    const routing: DeepPartial<RoutingStore> = {
      showSharePanel: false,
    }
    useStoresSpy.mockReturnValue({ routing })

    const mounted = render(<ShareLink />)
    const el = mounted.getByTestId('share-link')

    expect(el).toHaveTextContent(expected)
  })
})
