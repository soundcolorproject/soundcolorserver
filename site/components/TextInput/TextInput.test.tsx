
import { render } from '@testing-library/react'
import * as React from 'react'

import { TextInput, TextInputProps } from './TextInput'

const noop = () => undefined
const defaultProps: TextInputProps = {
  value: '',
  placeholder: 'Test Placeholder',
  onChange: noop,
}
describe(TextInput.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<TextInput {...defaultProps} className={testClass} />)
    expect(mounted.getByTestId('text-input').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<TextInput {...defaultProps} style={styles} />)
    expect(mounted.getByTestId('text-input').style).toHaveProperty('display', 'none')
  })
})
