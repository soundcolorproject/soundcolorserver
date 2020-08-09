
import { Page } from '../BasePage'

export class HomePanel extends Page<'Panel:Home'> {
  readonly name = 'Panel:Home'

  static verify () {
    return cy.visible('[data-testid="shrinking-side-panel"]')
  }
}
