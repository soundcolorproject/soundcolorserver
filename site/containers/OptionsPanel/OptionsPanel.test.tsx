
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { OptionsPanel } from './OptionsPanel'
import { PatternsStore } from '../../state/patternsStore'

describe(OptionsPanel.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'Chaky-Ras'

    const patterns: DeepPartial<PatternsStore> = {
      currentPattern: 'chakras',
      patternData: {
        chakras: {
          description: expected,
        },
      },
    }
    useStoresSpy.mockReturnValue({ patterns })

    const mounted = render(<OptionsPanel />)
    const el = mounted.getByTestId('options-panel')

    expect(el).toHaveTextContent(expected)
  })
})
