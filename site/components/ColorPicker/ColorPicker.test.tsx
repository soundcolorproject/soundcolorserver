
import * as React from 'react'
import { render } from '@testing-library/react'

import { ColorPicker, ColorPickerProps } from './ColorPicker'
import Pickr from '@simonwep/pickr'

const noop = () => undefined
const defaultProps: ColorPickerProps = {
  value: '#fab',
  onChange: noop,
}

jest.mock('@simonwep/pickr')

describe(ColorPicker.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<ColorPicker {...defaultProps} className={testClass} />)
    expect(mounted.getByTestId('color-picker').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<ColorPicker {...defaultProps} style={styles} />)
    expect(mounted.getByTestId('color-picker').style).toHaveProperty('display', 'none')
  })
})
