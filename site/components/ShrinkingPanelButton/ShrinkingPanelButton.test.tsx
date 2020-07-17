
import * as React from 'react'
import { render } from '@testing-library/react'

import { ShrinkingPanelButton } from './ShrinkingPanelButton'

describe(ShrinkingPanelButton.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<ShrinkingPanelButton className={testClass} />)
    expect(mounted.getByTestId('shrinking-panel-button').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<ShrinkingPanelButton style={styles} />)
    expect(mounted.getByTestId('shrinking-panel-button').style).toHaveProperty('display', 'none')
  })
})
