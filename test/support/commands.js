Cypress.Commands.add('getByTestId', testId => cy.get(`[data-testid="${testId}"]`));
Cypress.Commands.add('getByTitle', title => cy.get(`[title="${title}"]`));
Cypress.Commands.add('getTooltip', () => cy.get('[role="tooltip"]'));
Cypress.Commands.add('getByDataPreview', dataPreview => cy.get(`[data-preview="${dataPreview}"]`));
