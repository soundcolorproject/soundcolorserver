
import * as React from 'react'
import { render } from '@testing-library/react'

import { Panel } from './Panel'

describe(Panel.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<Panel title='stuff' className={testClass} />)
    expect(mounted.getByTestId('panel').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<Panel title='Test Panel' style={styles} />)
    expect(mounted.getByTestId('panel').style).toHaveProperty('display', 'none')
  })
})
