
import { render } from '@testing-library/react'
import * as React from 'react'

import { LinkButton, LinkButtonProps } from './LinkButton'

describe(LinkButton.name, () => {
  const defaultProps: LinkButtonProps = {
    to: '/foo',
    children: '',
  }

  it('should render the given class', () => {
    const testClass = 'myClass'
    const mounted = render(<LinkButton {...defaultProps} className={testClass} />)
    expect(mounted.getByTestId('link-button').classList).toContain(testClass)
  })

  it('renders the `to` prop as the anchor `href`', () => {
    const route = '/some/route'

    const mounted = render(<LinkButton {...defaultProps} to={route} />)
    const link = mounted.getByTestId('link-button')

    expect(link).toHaveProperty('href', `http://localhost${route}`)
  })
})
