
import { createEvent, fireEvent, render } from '@testing-library/react'
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

  it('calls onClick when clicked', () => {
    const handler = jest.fn()

    const mounted = render(<Button onClick={handler} />)
    const button = mounted.getByTestId('button')
    fireEvent.click(button)

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not prevent the event default if `preventDefault` not set and `type` is `submit`', () => {
    const mounted = render(<Button type='submit' />)
    const button = mounted.getByTestId('button')
    const ev = createEvent.click(button)
    fireEvent(button, ev)

    expect(ev.defaultPrevented).toBeFalsy()
  })

  it('prevents the event default`type` is not `submit`', () => {
    const mounted = render(<Button />)
    const button = mounted.getByTestId('button')
    const ev = createEvent.click(button)
    fireEvent(button, ev)

    expect(ev.defaultPrevented).toBeTruthy()
  })

  it('does not prevent the event default if `preventDefault` set explicitly to `false`', () => {
    const mounted = render(<Button preventDefault={false} />)
    const button = mounted.getByTestId('button')
    const ev = createEvent.click(button)
    fireEvent(button, ev)

    expect(ev.defaultPrevented).toBeFalsy()
  })

  it('prevents the event default if `preventDefault` set', () => {
    const mounted = render(<Button preventDefault />)
    const button = mounted.getByTestId('button')
    const ev = createEvent.click(button)
    fireEvent(button, ev)

    expect(ev.defaultPrevented).toBeTruthy()
  })

  it('renders an icon if preIcon is present', () => {
    const mounted = render(<Button preIcon='info' />)
    mounted.getByTestId('button-pre-icon')
  })

  it('renders the text passed into it', () => {
    const text = 'This is some test text'

    const mounted = render(<Button>{text}</Button>)
    const button = mounted.getByTestId('button')

    expect(button).toHaveTextContent(text)
  })

  it('renders a regular button if `type` not specified', () => {
    const mounted = render(<Button />)
    const button = mounted.getByTestId('button')

    expect(button).toHaveProperty('type', 'button')
  })

  it('renders a submit button if `type` set to `submit`', () => {
    const mounted = render(<Button type='submit' />)
    const button = mounted.getByTestId('button')

    expect(button).toHaveProperty('type', 'submit')
  })
})
