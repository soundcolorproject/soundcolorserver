
import * as React from 'react'
import * as cn from 'classnames'

import { IconName, Icon } from '../Icon'

import {
  menuOption,
  clickable,
  menuButton,
  menuButtonLabel,
  menuButtonIcon,
} from './menuOption.pcss'
import { logger } from '../../../shared/logger'

export interface MenuOptionProps {
  className?: string
  children: React.ReactElement | string
  icon?: IconName
}

export function MenuOption (props: MenuOptionProps) {
  const { className, children, icon } = props

  return (
    <div
      className={cn(menuOption, className)}
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
  const { className, children, onClick, icon } = props

  function handleClick (ev: React.MouseEvent) {
    ev.preventDefault()
    onClick()
  }

  return (
    <button
      type='button'
      role='button'
      className={cn(menuOption, clickable, className)}
      onClick={handleClick}
    >
      {children}
      {icon && <Icon color='var(--black)' name={icon} />}
    </button>
  )
}

export interface ButtonMenuOptionProps extends ClickableMenuOptionProps {
  buttonClass?: string
}

export function ButtonOption (props: ButtonMenuOptionProps) {
  const { className, buttonClass, children, icon, onClick } = props

  function handleClick (ev: React.MouseEvent) {
    ev.preventDefault()
    onClick()
  }

  logger.log('ButtonOption', icon)

  return (
    <div
      className={cn(menuOption, className)}
    >
      <button className={cn(menuButton, buttonClass)} onClick={handleClick}>
        <span className={menuButtonLabel}>
          {children}
        </span>
        {
          icon && <Icon
            className={menuButtonIcon}
            color='var(--white)'
            name={icon}
          />
        }
      </button>
    </div>
  )
}

export interface LinkMenuOptionProps extends MenuOptionProps {
  href: string
}

export function LinkMenuOption (props: LinkMenuOptionProps) {
  const { className, children, href, icon } = props

  return (
    <a
      className={cn(menuOption, clickable, className)}
      href={href}
    >
      {children}
      {icon && <Icon color='var(--black)' name={icon} />}
    </a>
  )
}
