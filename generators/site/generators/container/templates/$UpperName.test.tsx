
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from 'site/state/mockUseStores'

import { $UpperName } from './$UpperName'
import { PatternsStore } from 'site/state/patternsStore'

describe($UpperName.name, () => {
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

    const mounted = render(<$UpperName />)
    const el = mounted.getByTestId('$dash-name')

    expect(el).toHaveTextContent(expected)
  })
})
