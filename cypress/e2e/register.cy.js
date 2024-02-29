/**
 * To test:
 *
 * 1. open a terminal and run the app to test:
 * $ npm start
 *
 * 2. open a terminal and open the cypress app:
 * $ npx cypress open
 *
 * 3. in the cypress app open the test to verify
 *
 * 4. create or modify a cypress test and cypress executes all the tests automatically
 */

describe('Administration container backend', () => {
  beforeEach(() => {
    cy.visit('/ui/v1/registers');
  });

  it('must exists a service heading', () => {
    cy.getByData('service-heading').should('exist');
    cy.getByData('pagination-form').should('exist');
  });

  it('allows user to paginate data', () => {
    cy.getByData('pagination-form-skip').type('{selectAll}100');
    cy.getByData('pagination-form-limit').type('{selectAll}1000');
    cy.getByData('pagination-form-submit').click();
    // Verifiy that the skip and new limit values are displayed after data is retrieved
    cy.getByData('pagination-form-skip').should('have.value', '100');
    cy.getByData('pagination-form-limit').should('have.value', '1000');
  });

  it('does not allow to paginate with wrong data', () => {
    cy.getByData('pagination-form-skip').type('{selectAll}X');
    cy.getByData('pagination-form-limit').type('{selectAll}X');
    cy.getByData('pagination-form-submit').click();
    // Verifiy that the incorrect skip and new limit values are reset to default
    cy.getByData('pagination-form-skip').should('have.value', '0');
    cy.getByData('pagination-form-limit').should('have.value', '150');
  });

  // TODO: afegirm tests per validar les dades d'entrada i detectar quan falla
});
