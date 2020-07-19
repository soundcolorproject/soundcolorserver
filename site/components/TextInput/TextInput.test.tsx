
import * as React from 'react'
import { render } from '@testing-library/react'

import { TextInput } from './TextInput'

describe(TextInput.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<TextInput className={testClass} />)
    expect(mounted.getByTestId('text-input').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<TextInput style={styles} />)
    expect(mounted.getByTestId('text-input').style).toHaveProperty('display', 'none')
  })
})
