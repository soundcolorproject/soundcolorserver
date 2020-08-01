
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { SharePanel } from './SharePanel'
import { PatternsStore } from '../../state/patternsStore'
import { RoutingStore } from '../../state/routingStore'

describe(SharePanel.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Facebook'

    const routing: DeepPartial<RoutingStore> = {
      showSharePanel: false,
    }
    useStoresSpy.mockReturnValue({ routing })

    const mounted = render(<SharePanel />)
    const el = mounted.getByTestId('share-panel-facebook-button')

    expect(el).toHaveTextContent(expected)
  })
})
