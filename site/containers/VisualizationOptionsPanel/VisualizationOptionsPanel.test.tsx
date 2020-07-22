
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { VisualizationOptionsPanel } from './VisualizationOptionsPanel'
import { PatternsStore } from '../../state/patternsStore'

describe(VisualizationOptionsPanel.name, () => {
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

    const mounted = render(<VisualizationOptionsPanel />)
    const el = mounted.getByTestId('visualization-options-panel')

    expect(el).toHaveTextContent(expected)
  })
})
