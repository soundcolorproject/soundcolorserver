
import { render } from '@testing-library/react'
import * as React from 'react'

import { IntroStore } from '../../state/introStore'
import { mockUseStores } from '../../state/mockUseStores'
import { PatternsStore } from '../../state/patternsStore'

import { ColorWarning } from './ColorWarning'

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
