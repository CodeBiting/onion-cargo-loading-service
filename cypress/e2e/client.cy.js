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

describe('Administration client backend', () => {
  beforeEach(() => {
    cy.visit('/ui/v1/clients')
  });

  it('must exists a service heading', () => {
    cy.getByData('service-heading').should("exist")
    cy.getByData('pagination-form').should("exist")

    cy.getByData('add-button').should("exist")
    cy.getByData('modify-button').should("exist")
    cy.getByData('delete-button').should("exist")

    cy.getByData('add-form').should("exist")
    cy.getByData('modify-form').should("exist")
    cy.getByData('delete-form').should("exist")
  });

  it('allows user to paginate data', () => {
    cy.getByData("pagination-form-skip").type("{selectAll}100")
    cy.getByData("pagination-form-limit").type("{selectAll}1000")
    cy.getByData("pagination-form-submit").click()
    // Verifiy that the skip and new limit values are displayed after data is retrieved
    cy.getByData("pagination-form-skip").should("have.value", "100")
    cy.getByData("pagination-form-limit").should("have.value", "1000")
  });

  it('does not allow to paginate with wrong data', () => {
    cy.getByData("pagination-form-skip").type("{selectAll}X")
    cy.getByData("pagination-form-limit").type("{selectAll}X")
    cy.getByData("pagination-form-submit").click()
    // Verifiy that the incorrect skip and new limit values are reset to default
    cy.getByData("pagination-form-skip").should("have.value", "0")
    cy.getByData("pagination-form-limit").should("have.value", "150")
  });

  it('allows user to add a new client', () => {
    // Click to display de form
    cy.getByData("add-button").click()

    // Verify thant the add form method is 1 = CREATE
    cy.getByData("add-form-method").should("have.value", "1");

    // fill the form and submit
    cy.getByData("add-form-code").type("{selectAll}Client-Code")
    cy.getByData("add-form-dateStart").type('2023-12-23')
    cy.getByData("add-form-dateFinal").type('2025-12-23')
    cy.getByData("add-form-active").click()
    cy.getByData("add-form-token").type("{selectAll}TOKEN")
    cy.getByData("add-form-notes").type("{selectAll}Client notes")
    cy.getByData("add-form-submit").click()

    // Verifiy that apears a info message confirming the client creation
    cy.getByData("message-info").should("exist") 

    // Verify that the new client exists
    cy.getByData("message-info").should("exist")
    cy.getByData("data-grid").should("exist")

    // TODO: recuperar el registre client afegit, modificar-lo i eliminar-lo
    cy.get('[col-id="id"]').last().then(($client) => {
      // get the client id
      const clientToDeleteId = $client.text()
      //cy.log(clientToDeleteId)
      //cy.log('created client id = ', clientToDeleteId)

      // Delete added client: Click to display de form
      cy.getByData("delete-button").click()

      // Verify thant the add form method is 3 = DELETE
      cy.getByData("delete-form-method").should("have.value", "3");

      // fill the form and submit
      cy.getByData("delete-form-id").type("{selectAll}")
      cy.getByData("delete-form-id").type(clientToDeleteId)
      cy.getByData("delete-form-submit").click()

      // Verifiy that apears a info message confirming the client creation
      cy.getByData("message-info").should("exist")
    })
  });

  // TODO: afegirm tests per validar les dades d'entrada i detectar quan falla
})