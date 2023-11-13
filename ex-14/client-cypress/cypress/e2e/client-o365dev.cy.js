
function logIn() {
    cy.visit('/');
    cy.get('#SignIn').click();
}

describe('Client should open and render initial page', () => {

    it('Opens initial web page', () => {

        cy.visit('/');
        cy.contains('Game of Thrones Episodes');
        cy.get('#SignIn').should('contain', 'Sign In');
        cy.getCookies('sessionID').should('exist');
        
    });
 
    it('Should be able to sign in', () => {
        cy.visit('/');
        cy.get('#SignIn').click();

        cy.contains('Game of Thrones Episodes');
        cy.get('#Logout').should('contain', 'Logout');  
    });

});

describe('Main menu should render and we should be able to log-out', () => {

    it('We sign in', () => {
        logIn();

        cy.contains('Game of Thrones Episodes');
        cy.get('#Logout').should('contain', 'Logout');
    });

   
    it('Main meny contains correct items', () => {
        logIn();

        cy.get('#Logout').should('contain', 'Logout');
        cy.get('#showinbox').should('contain', 'Show Inbox');        
        cy.get('#got').should('contain','Show GOT episodes');
        cy.get('#showindex').should('contain','Home');
    });

    it('We do a log-out', () => {
        logIn();

        cy.get('#Logout').click();

        cy.contains('Game of Thrones Episodes');
        cy.get('#SignIn').should('contain', 'Sign In');

    });

});

describe('The inbox should be accessible', () => {

    beforeEach(() => {
        logIn();
    });

    it('We can select the inbox',  () => {
   
        cy.get('#showinbox').click();
       
    });

    it('The Inbox shows data for test user Adele', () => {

        cy.fixture('test-user','utf-8').then((testUser) => {
        
            cy.contains('List my inbox');
            cy.contains(testUser.name);
            cy.contains(testUser.email); 
          
        });        
    });

});

describe('We should get a list of GOT Episodes', () => {

    beforeEach(() => {
        logIn();
    });

    it('We should be able to log in and select got episodes', () => {
        cy.get('#got').should('contain', 'Show GOT episodes');
        cy.get('#Logout').should('contain', 'Logout');
        cy.get('#got').click();
    });


    it('We should request GOT episodes', () => {
        cy.get('#got').click();
        cy.contains('Got Episodes');
        cy.contains('Winter is coming');
        cy.contains('Quote:');
    });

    it('We should be able to select HOME', () => {
        cy.get('#showindex').click();
        cy.contains('List my inbox');
        cy.get('#Logout').should('contain', 'Logout');
    });

    it('We should request GOT episodes directly', () => {
        cy.visit('/got');
        cy.contains('Got Episodes');
        cy.contains('Winter is coming');
        cy.contains('Quote:');
    });

});

describe('Client should serve proper headers', () => {

    it('Response header contains proper CSP', () => {
        cy.request('/').should((response) => {
            
           
            console.log(response.headers);

            expect(response).to.have.property('headers');
            expect(response.headers).to.have.property('content-security-policy');

            expect(response.headers['content-security-policy']).to.have.string('default-src \'self\'');
            expect(response.headers['content-security-policy']).to.have.string('block-all-mixed-content');
            expect(response.headers['content-security-policy']).to.have.string('script-src \'self\'');
        });
    });
        
});
