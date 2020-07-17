
import * as React from 'react'
import { render } from '@testing-library/react'

import { ShrinkingSidePanel } from './ShrinkingSidePanel'

describe(ShrinkingSidePanel.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<ShrinkingSidePanel className={testClass} />)
    expect(mounted.getByTestId('shrinking-side-panel').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<ShrinkingSidePanel style={styles} />)
    expect(mounted.getByTestId('shrinking-side-panel').style).toHaveProperty('display', 'none')
  })
})
