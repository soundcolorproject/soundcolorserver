
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { ConnectionsPanel } from './ConnectionsPanel'
import { PatternsStore } from '../../state/patternsStore'
import { MediaStore } from '../../state/mediaStore'
import { ApiStatusStore } from '../../state/apiStatusStore'
import { RoutingStore } from '../../state/routingStore'

describe(ConnectionsPanel.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Philips Hue - Login'
    const media: DeepPartial<MediaStore> = {
      currentDeviceId: undefined,
    }
    const apiStatus: DeepPartial<ApiStatusStore> = {
      authenticated: false,
    }
    const routing: DeepPartial<RoutingStore> = {
      goToSubroute: jest.fn(),
    }
    useStoresSpy.mockReturnValue({ media, apiStatus, routing })

    const mounted = render(<ConnectionsPanel />)
    const el = mounted.getByTestId('connections-panel-philips-hue-button')

    expect(el).toHaveTextContent(expected)
  })
})
