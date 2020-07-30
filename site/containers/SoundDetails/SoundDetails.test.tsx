
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { SoundDetails } from './SoundDetails'
import { PatternsStore } from '../../state/patternsStore'
import { AnalysisStore } from '../../state/analysisStore'

describe(SoundDetails.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Primary Tone Volume: •'

    const analysis: DeepPartial<AnalysisStore> = {
      noise: 0,
      tones: [],
    }
    useStoresSpy.mockReturnValue({ analysis })

    const mounted = render(<SoundDetails />)
    const el = mounted.getByTestId('sound-details-tone')

    expect(el).toHaveTextContent(expected)
  })
})
