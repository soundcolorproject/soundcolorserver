
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { CookiePolicyPanel } from './CookiePolicyPanel'
import { PatternsStore } from '../../state/patternsStore'

describe(CookiePolicyPanel.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'In order to use our Hue functionality, you need to accept the use of cookies.'

    const patterns: DeepPartial<PatternsStore> = {
      currentPattern: 'chakras',
      patternData: {
        chakras: {
          description: expected,
        },
      },
    }
    useStoresSpy.mockReturnValue({ patterns })

    const mounted = render(<CookiePolicyPanel />)
    const el = mounted.getByTestId('cookie-policy-panel')

    expect(el).toContainHTML(expected)
  })
})
