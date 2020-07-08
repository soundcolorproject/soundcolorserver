
import * as React from 'react'
import { render } from '@testing-library/react'

import { $UpperName } from './$UpperName'

describe($UpperName.name, () => {
  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<$UpperName className={testClass} />)
    expect(mounted.getByTestId('$dash-name').classList).toContain(testClass)
  })

  it('should render the given styles', () => {
    const styles = { display: 'none' }
    const mounted = render(<$UpperName style={styles} />)
    expect(mounted.getByTestId('$dash-name').style).toHaveProperty('display', 'none')
  })
})
