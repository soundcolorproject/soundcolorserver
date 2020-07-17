
import * as React from 'react'
import { render } from '@testing-library/react'

import { Props, MainPanelWithShrinkingSide } from './MainPanelWithShrinkingSide'

const defaultProps: Props = {
  sidePanel: <div key='side-panel' />,
  height: 320,
  children: <div key='children' />,
  transitionDirection: 'up',
  open: false,
}

describe(MainPanelWithShrinkingSide.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<MainPanelWithShrinkingSide {...defaultProps} className={testClass} />)
    expect(mounted.getByTestId('main-panel-with-shrinking-side').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<MainPanelWithShrinkingSide {...defaultProps} style={styles} />)
    expect(mounted.getByTestId('main-panel-with-shrinking-side').style).toHaveProperty('display', 'none')
  })
})
