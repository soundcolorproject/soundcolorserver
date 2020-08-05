
import { render } from '@testing-library/react'
import * as React from 'react'

import { toHsv } from '../../pcss-functions'
import { mockUseStores } from '../../state/mockUseStores'
import { Note, PatternsStore } from '../../state/patternsStore'

import { CustomPatternSelector } from './CustomPatternSelector'

jest.mock('@simonwep/pickr')
const noop = () => undefined
describe(CustomPatternSelector.name, () => {
  const useStoresSpy = mockUseStores()

  beforeEach(() => {
    useStoresSpy.mockReset()
  })

  it('should render', () => {
    const expected = 'A'
    const notes: Note[] = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
    const colors: any = {
      reset: noop,
    }
    notes.forEach(note => {
      colors[note] = toHsv('#fff')
    })

    const patterns: DeepPartial<PatternsStore> = {
      currentPattern: 'chakras',
      patternData: {
        custom: {
          colors,
        },
      },
      notes,
    }
    useStoresSpy.mockReturnValue({ patterns })

    const mounted = render(<CustomPatternSelector />)
    const el = mounted.getByTestId('custom-pattern-selector-picker-A')

    expect(el).toHaveTextContent(expected)
  })
})
