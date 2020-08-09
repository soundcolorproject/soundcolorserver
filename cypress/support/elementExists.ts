
export function elementExists (selector: string) {
  return new Promise<boolean>((resolve) => {
    cy.get('body').find(selector).its('length').then(count => {
      resolve(count > 0)
    })
  })
}
