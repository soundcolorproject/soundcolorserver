
import * as React from 'react'
import * as cn from 'classnames'

import { IconName, Icon } from '../Icon'

import { menuOption, clickable } from './menuOption.pcss'

export interface MenuOptionProps {
  children: React.ReactElement
  icon?: IconName
}

export function MenuOption (props: MenuOptionProps) {
  const { children, icon } = props

  return (
    <div
      className={menuOption}
    >
      {children}
      {icon && <Icon color='var(--black)' name={icon} />}
    </div>
  )
}

export interface ClickableMenuOptionProps extends MenuOptionProps {
  onClick: () => void
}

export function ClickableMenuOption (props: ClickableMenuOptionProps) {
  const { children, onClick, icon } = props

  function handleClick (ev: React.MouseEvent) {
    ev.preventDefault()
    onClick()
  }

  return (
    <button
      type='button'
      role='button'
      className={cn(menuOption, clickable)}
      onClick={handleClick}
    >
      {children}
      {icon && <Icon color='var(--black)' name={icon} />}
    </button>
  )
}

export interface LinkMenuOptionProps extends MenuOptionProps {
  href: string
}

export function LinkMenuOption (props: LinkMenuOptionProps) {
  const { children, href, icon } = props

  return (
    <a
      className={cn(menuOption, clickable)}
      href={href}
    >
      {children}
      {icon && <Icon color='var(--black)' name={icon} />}
    </a>
  )
}
