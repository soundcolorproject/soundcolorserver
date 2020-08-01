
import { render } from '@testing-library/react'
import * as React from 'react'

import { PanelButton } from './PanelButton'

describe(PanelButton.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<PanelButton className={testClass} />)
    expect(mounted.getByTestId('panel-button').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<PanelButton style={styles} />)
    expect(mounted.getByTestId('panel-button').style).toHaveProperty('display', 'none')
  })
})
