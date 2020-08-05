
import { render } from '@testing-library/react'
import * as React from 'react'

import { MediaStore } from '../../state/mediaStore'
import { mockUseStores } from '../../state/mockUseStores'
import { RoutingStore } from '../../state/routingStore'

import { AudioSourceSelector } from './AudioSourceSelector'

describe(AudioSourceSelector.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'No audio sources connected.'

    const media: DeepPartial<MediaStore> = {
      ready: true,
      possibleDevices: [],
    }
    const routing: DeepPartial<RoutingStore> = {
    }
    useStoresSpy.mockReturnValue({ media, routing })

    const mounted = render(<AudioSourceSelector />)
    const el = mounted.getByTestId('audio-source-selector')

    expect(el).toHaveTextContent(expected)
  })
})
