
import { render } from '@testing-library/react'
import * as React from 'react'

import { Button } from './Button'

describe(Button.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<Button className={testClass} />)
    expect(mounted.getByTestId('button').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<Button style={styles} />)
    expect(mounted.getByTestId('button').style).toHaveProperty('display', 'none')
  })
})
