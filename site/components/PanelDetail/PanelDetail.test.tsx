
import { render } from '@testing-library/react'
import * as React from 'react'

import { PanelDetail } from './PanelDetail'

describe(PanelDetail.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<PanelDetail className={testClass} />)
    expect(mounted.getByTestId('panel-detail').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<PanelDetail style={styles} />)
    expect(mounted.getByTestId('panel-detail').style).toHaveProperty('display', 'none')
  })
})
