
import { InfoPage } from './InfoPage'
import { HomePanel } from './panels/HomePanel'
import { SovisPage } from './SovisPage'

export type AnyPage = InfoPage | SovisPage | HomePanel

export abstract class Page<Name extends string> {
  abstract readonly name: Name

  private static _currentPage: AnyPage

  protected constructor () {
  }

  static get current (): AnyPage {
    return this._currentPage
  }

  protected static setCurrentPage<T extends AnyPage> (page: T): T {
    Page._currentPage = page
    return page
  }

  static get info (): InfoPage {
    if (Page.current.name !== 'Info') {
      throw new Error()
    }

    return Page.current
  }
}
