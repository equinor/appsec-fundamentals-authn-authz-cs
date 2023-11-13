// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Cypress.Commands.add('login', (overrides = {}) => {
//     Cypress.log({
//         name: 'loginViaAzureAD',
//     });

//     const options = {
//         method: 'POST',
//         url: 'https://login.microsoftonline.com/86bf7fcb-22b4-4bfb-9a3d-84bf87741cc4/oauth2/v2.0/token',
//         body: {
//             grant_type: 'password',
//             username: '',
//             password: '',
//             scope: 'openid profile email',
//             client_id: '8a7449b6-fd50-4003-afab-427939b21082',
//             client_secret: '',
//         },
//         form: true
//     };
//     cy.request(options);
// });