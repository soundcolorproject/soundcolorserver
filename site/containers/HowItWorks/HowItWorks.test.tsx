
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { HowItWorks } from './HowItWorks'
import { PatternsStore } from '../../state/patternsStore'
import { IntroStore } from '../../state/introStore'
import { RenderStateStore } from '../../state/renderStateStore'

describe(HowItWorks.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Start SOVIS'

    const intro: DeepPartial<IntroStore> = {
    }
    const patterns: DeepPartial<PatternsStore> = {
    }
    const renderState: DeepPartial<RenderStateStore> = {
    }
    useStoresSpy.mockReturnValue({ intro, patterns, renderState })

    const mounted = render(<HowItWorks />)
    const el = mounted.getByTestId('how-it-works-button')

    expect(el).toHaveTextContent(expected)
  })
})
