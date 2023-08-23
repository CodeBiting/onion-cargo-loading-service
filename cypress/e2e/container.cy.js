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
        cy.visit('/ui/v1/containers')
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

    it('allows user to add a new container and delete it', () => {
        // Click to display de form
        cy.getByData("add-button").click()
    
        // Verify thant the add form method is 1 = CREATE
        cy.getByData("add-form-method").should("have.value", "1");
    
        // fill the form and submit
        cy.getByData("add-form-clientId").type("{selectAll}1")
        cy.getByData("add-form-code").type('{selectAll}Container-code')
        cy.getByData("add-form-description").type('{selectAll}Description')
        cy.getByData("add-form-width").type("{selectAll}1")
        cy.getByData("add-form-length").type("{selectAll}1")
        cy.getByData("add-form-height").type("{selectAll}1")
        cy.getByData("add-form-maxWeight").type("{selectAll}1")
        cy.getByData("add-form-submit").click()
    
        // Verifiy that apears a info message confirming the client creation
        cy.getByData("message-info").should("exist") 
    
        // Verify that the new client exists
        cy.getByData("data-grid").should("exist")
    
        cy.get('[col-id="id"]').last().then(($client) => {
          // get the client id
          const clientToDeleteId = $client.text()
          //cy.log(clientToDeleteId)
          //cy.log('created client id = ', clientToDeleteId)
    
          //Click the id of the client created
          cy.get('[col-id="id"]').last().click();
    
          // Delete added client: Click to display de form
          cy.getByData("delete-button").click()
    
          // Verify thant the add form method is 3 = DELETE
          cy.getByData("delete-form-method").should("have.value", "3");
          
          // fill the form and submit
          cy.getByData("delete-form-id").should("have.value",clientToDeleteId);
          cy.getByData("delete-form-submit").click()
    
          // Verifiy that apears a info message confirming the client creation
          cy.getByData("message-info").should("exist")
        })
      });

      it('allows user to add a new container then desactivate, activate and delete it', () => {
        // Click to display de form
        cy.getByData("add-button").click()
    
        // Verify thant the add form method is 1 = CREATE
        cy.getByData("add-form-method").should("have.value", "1");
    
        // fill the form and submit
        cy.getByData("add-form-clientId").type("{selectAll}1")
        cy.getByData("add-form-code").type('{selectAll}Container-code')
        cy.getByData("add-form-description").type('{selectAll}Description')
        cy.getByData("add-form-width").type("{selectAll}1")
        cy.getByData("add-form-length").type("{selectAll}1")
        cy.getByData("add-form-height").type("{selectAll}1")
        cy.getByData("add-form-maxWeight").type("{selectAll}1")
        cy.getByData("add-form-submit").click()
    
        // Verifiy that apears a info message confirming the client creation
        cy.getByData("message-info").should("exist") 
    
        // Verify that the new client exists
        cy.getByData("data-grid").should("exist")
    
        cy.get('[col-id="id"]').last().then(($client) => {
            // get the client id
            const clientToDeleteId = $client.text()
            //cy.log(clientToDeleteId)
            //cy.log('created client id = ', clientToDeleteId)

            //Click the id of the client created
            cy.get('[col-id="id"]').last().click();

            //Desactivate added client: Click to display form
            cy.getByData("desactivate-button").click()

            // Verify thant the add form method is 4 = DESACTIVATE
            cy.getByData("desactivate-form-method").should("have.value", "4");

            //fill the form and sumit
            cy.getByData("desactivate-form-id").should("have.value",clientToDeleteId);
            cy.getByData("desactivate-form-submit").click();

            // Verifiy that apears a info message confirming the client creation
            cy.getByData("message-info").should("exist")

            // Click to display de form
            cy.getByData("add-button").click()

            // fill the form and submit
            cy.getByData("add-form-clientId").type("{selectAll}1")
            cy.getByData("add-form-code").type("{selectAll}Container-Code")
            cy.getByData("add-form-submit").click();

            // verify that activate client is shown 
            cy.getByData("active-form").should("exist")

            // submit the popup
            cy.getByData("active-form-submit").click()      

            // Verifiy that apears a info message confirming the client creation
            cy.getByData("message-info").should("exist")
            
            //Click the id of the client created
            cy.get('[col-id="id"]').last().click();
        
            // Delete added client: Click to display de form
            cy.getByData("delete-button").click()
        
            // Verify thant the add form method is 3 = DELETE
            cy.getByData("delete-form-method").should("have.value", "3");
            
            // fill the form and submit
            cy.getByData("delete-form-id").should("have.value",clientToDeleteId);
            cy.getByData("delete-form-submit").click()
        
            // Verifiy that apears a info message confirming the client creation
            cy.getByData("message-info").should("exist")
        })
      });

      it('allows user to create a Container modify it and then delete id', () => {
        // Click to display de form
        cy.getByData("add-button").click()
    
        // Verify thant the add form method is 1 = CREATE
        cy.getByData("add-form-method").should("have.value", "1");
    
        // fill the form and submit
        cy.getByData("add-form-clientId").type("{selectAll}1")
        cy.getByData("add-form-code").type('{selectAll}Container-code')
        cy.getByData("add-form-description").type('{selectAll}Description')
        cy.getByData("add-form-width").type("{selectAll}1")
        cy.getByData("add-form-length").type("{selectAll}1")
        cy.getByData("add-form-height").type("{selectAll}1")
        cy.getByData("add-form-maxWeight").type("{selectAll}1")
        cy.getByData("add-form-submit").click()
    
        // Verifiy that apears a info message confirming the client creation
        cy.getByData("message-info").should("exist")
    
        // Verify that the new client exists
        cy.getByData("data-grid").should("exist")
    
        cy.get('[col-id="id"]').last().then(($client) => {
            // get the client id
            const clientToDeleteId = $client.text()
            //cy.log(clientToDeleteId)
            //cy.log('created client id = ', clientToDeleteId)

            //Click the id of the client created
            cy.get('[col-id="id"]').last().click();

            // Click to display de form
            cy.getByData("modify-button").click();

            // Verify thant the add form method is 1 = CREATE
            cy.getByData("modify-form-method").should("have.value", "2");
            cy.getByData("modify-form-id").should("have.value",clientToDeleteId);

            // fill the form and submit
            cy.getByData("modify-form-description").type("{selectAll}New Description");
            cy.getByData("modify-form-submit").click();

            cy.getByData("message-info").should("exist")

            //Click the id of the client created
            cy.get('[col-id="id"]').last().click();
        
            // Delete added client: Click to display de form
            cy.getByData("delete-button").click()
        
            // Verify thant the add form method is 3 = DELETE
            cy.getByData("delete-form-method").should("have.value", "3");
            
            // fill the form and submit
            cy.getByData("delete-form-id").should("have.value",clientToDeleteId);
            cy.getByData("delete-form-submit").click()
        
            // Verifiy that apears a info message confirming the client creation
            cy.getByData("message-info").should("exist")
        })
      });
    // TODO: afegirm tests per validar les dades d'entrada i detectar quan falla
  })