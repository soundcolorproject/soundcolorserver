
import * as React from 'react'
import { render } from '@testing-library/react'

import { ColorPicker } from './ColorPicker'

describe(ColorPicker.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<ColorPicker className={testClass} />)
    expect(mounted.getByTestId('color-picker').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<ColorPicker style={styles} />)
    expect(mounted.getByTestId('color-picker').style).toHaveProperty('display', 'none')
  })
})
