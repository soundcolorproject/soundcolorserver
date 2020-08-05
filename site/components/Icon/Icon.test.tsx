
import { render } from '@testing-library/react'
import * as React from 'react'

import { Icon, IconProps } from './Icon'

describe(Icon.name, () => {
  const defaultProps: IconProps = {
    name: 'info',
  }

  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<Icon {...defaultProps} className={testClass} />)
    expect(mounted.getByTestId('icon').classList).toContain(testClass)
  })
})
