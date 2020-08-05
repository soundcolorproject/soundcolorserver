
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import { Checkbox, CheckboxProps } from './Checkbox'

describe(Checkbox.name, () => {
  const defaultProps: CheckboxProps = {
    label: 'foo',
    checked: false,
    onChange: jest.fn(),
  }

  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<Checkbox {...defaultProps} className={testClass} />)
    expect(mounted.getByTestId('checkbox').classList).toContain(testClass)
  })

  it('calls onChange when clicked', () => {
    const handler = jest.fn()

    const mounted = render(<Checkbox {...defaultProps} onChange={handler} />)
    const checkbox = mounted.getByTestId('checkbox')
    fireEvent.click(checkbox)

    expect(handler).toHaveBeenCalledTimes(1)
  })
})
