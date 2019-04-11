// <reference types="Cypress" />
import l from '../../support/i18n';

describe('Create Task', () => {
    const getAssigneeField = () => cy.getByTestId('task-form-assignee-input');
    const getMessageField = () => cy.getByTestId('task-form-name-input');
    const getSubmitButton = () => cy.getByTestId('task-form-submit-button');
    const getCancelButton = () => cy.getByTestId('task-form-cancel-button');
    const username = 'Platform '; // will be used as assignee

    beforeEach(() => {
        cy.visit('/Elements/ContentSidebar'); // Open sidebar example page
        cy.getByTestId('sidebaractivity').click(); // Open activity tab
    });

    context('Add Task button', () => {
        it('opens task form', () => {
            cy.contains(l('be.tasks.addTask')).click();
            cy.contains(l('be.tasks.addTask.approval')).click();
            cy.getByTestId('create-task-modal').within(() => {
                cy.contains(l('be.tasks.addTaskForm.title')).should('exist');
                getSubmitButton().should('exist');
                getCancelButton().should('exist');
            });
        });
    });

    context('Task Form', () => {
        beforeEach(() => {
            cy.contains(l('be.tasks.addTask')).click();
        });
        it('does not allow submitting form without input', () => {
            getMessageField()
                .type('...')
                .clear();
            cy.contains('Required Field').should('exist');
        });

        it('creates task if form is filled out', () => {
            cy.getByTestId('create-task-modal').within(() => {
                getAssigneeField()
                    .type(username)
                    .trigger('keydown', { code: 'ArrowDown', which: 40 });
                cy.getByTestId('task-assignee-option').click();
                getMessageField().type('valid e2e task');

                getSubmitButton().click();
            });

            // modal should close
            cy.getByTestId('create-task-modal').should('not.exist');

            // validate task appears in feed
            // note that in the test environment task create fails with default token
            // but the card temporarily appears
            cy.getByTestId('activityfeed').within(() => {
                cy.getByTestId('task-card')
                    .last()
                    .within(() => {
                        cy.contains('valid e2e task').should('exist');
                    });
            });
        });
    });
});
