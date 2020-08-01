
import { render } from '@testing-library/react'
import * as React from 'react'

import { ApiStatusStore } from '../../state/apiStatusStore'
import { MediaStore } from '../../state/mediaStore'
import { mockUseStores } from '../../state/mockUseStores'
import { PatternsStore } from '../../state/patternsStore'
import { RoutingStore } from '../../state/routingStore'

import { ConnectionsPanel } from './ConnectionsPanel'

describe(ConnectionsPanel.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Philips Hue - Connect'
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
