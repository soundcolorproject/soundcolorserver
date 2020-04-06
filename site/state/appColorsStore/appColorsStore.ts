
import { observable, action, reaction } from 'mobx'
import cssVars from 'css-vars-ponyfill'

import {
  getDefault,
  getContrastingColor,
  makeCompliant,
  printRgb,
} from '../../pcss-functions'

import autoSave from '../autoSave'

export interface AppColorsProp {
  appColors: AppColorsStore
}

type ColorNames = 'background' | 'foreground' | 'primary' | 'secondary' | 'tertiary'

class AppColorsStore {
  constructor () {
    reaction(
      () => this.primary,
      () => this._setColor('primary', this.primary),
    )
    reaction(
      () => this.secondary,
      () => this._setColor('secondary', this.secondary),
    )
    reaction(
      () => this.tertiary,
      () => this._setColor('tertiary', this.tertiary),
    )
  }

  @observable black: string = getDefault('black')
  @observable white: string = getDefault('white')

  @observable background: string = getDefault('black')
  @observable foreground: string = getDefault('white')
  @observable primary: string = getDefault('primary')
  @observable secondary: string = getDefault('secondary')
  @observable tertiary: string = getDefault('tertiary')

  @action
  resetColors () {
    this.primary = getDefault('primary')
    this.secondary = getDefault('secondary')
    this.tertiary = getDefault('tertiary')
  }

  private _setColor (name: ColorNames, color: string) {
    const lightColor = makeCompliant(color, this.black)
    const darkColor = makeCompliant(color, this.white)

    cssVars({
      variables: {
        [`--${name}`]: color,
        [`--${name}-rgb`]: printRgb(color),
        [`--${name}-contrast`]: getContrastingColor(color),
        [`--${name}-light`]: lightColor.toString(),
        [`--${name}-light-rgb`]: printRgb(lightColor),
        [`--${name}-dark`]: darkColor.toString(),
        [`--${name}-dark-rgb`]: printRgb(darkColor),
      },
    })
  }
}

export const appColorsStore = autoSave('color')(new AppColorsStore())
