
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
  children: React.ReactElement | string
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

export function ButtonOption (props: ClickableMenuOptionProps) {
  const { children, icon, onClick } = props

  function handleClick (ev: React.MouseEvent) {
    ev.preventDefault()
    onClick()
  }

  logger.log('ButtonOption', icon)

  return (
    <div
      className={menuOption}
    >
      <button className={menuButton} onClick={handleClick}>
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
