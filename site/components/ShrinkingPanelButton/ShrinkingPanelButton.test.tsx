
import * as React from 'react'
import { render } from '@testing-library/react'

import { Props, ShrinkingPanelButton } from './ShrinkingPanelButton'

const defaultProps: Props = {
  children: 'text',
  icon: 'tune',
}

describe(ShrinkingPanelButton.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<ShrinkingPanelButton {...defaultProps} className={testClass} />)
    expect(mounted.getByTestId('shrinking-panel-button').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<ShrinkingPanelButton {...defaultProps} style={styles} />)
    expect(mounted.getByTestId('shrinking-panel-button').style).toHaveProperty('display', 'none')
  })
})
