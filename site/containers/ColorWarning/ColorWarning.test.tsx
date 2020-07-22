
import * as React from 'react'
import { render } from '@testing-library/react'
import { mockUseStores } from '../../state/mockUseStores'

import { ColorWarning } from './ColorWarning'
import { PatternsStore } from '../../state/patternsStore'
import { IntroStore } from '../../state/introStore'

describe(ColorWarning.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = '<h1>Warning:</h1>'

    const intro: DeepPartial<IntroStore> = {
    }
    useStoresSpy.mockReturnValue({ intro })

    const mounted = render(<ColorWarning />)
    const el = mounted.getByTestId('color-warning')

    expect(el).toContainHTML(expected)
  })
})
