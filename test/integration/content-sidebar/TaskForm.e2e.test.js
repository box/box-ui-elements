// <reference types="Cypress" />
import l from '../../support/i18n';

describe('Create Task', () => {
    const getAssigneeField = () => cy.getByTestId('task-form-assignee-input');
    const getMessageField = () => cy.getByTestId('task-form-name-input');
    const getSubmitButton = () => cy.getByTestId('task-form-submit-button');
    const getCancelButton = () => cy.getByTestId('task-form-cancel-button');
    const username = 'PreviewTestApp'; // will be used as assignee

    beforeEach(() => {
        cy.visit('/Elements/ContentSidebar'); // Open sidebar example page
    });

    context('Add Task button', () => {
        it('opens task form', () => {
            cy.contains(l('be.tasks.addTask')).click();
            cy.contains(l('be.tasks.addTask.approval')).click();
            cy.getByTestId('create-task-modal').within(() => {
                cy.contains(l('be.tasks.createTask.approval.title')).should('exist');
                getSubmitButton().should('exist');
                getCancelButton().should('exist');
            });
        });
    });

    context('Task Form', () => {
        beforeEach(() => {
            cy.server();
            cy.contains(l('be.tasks.addTask')).click();
            cy.contains(l('be.tasks.addTask.approval')).click();
        });
        it('does not allow submitting form without input', () => {
            getMessageField()
                .type('...')
                .clear();
            cy.contains('Required Field').should('exist');
        });

        it('shows error state after receiving server error', () => {
            cy.route('POST', '**/undoc/tasks').as('createTaskLink');
            getSubmitButton().should('not.have.class', 'is-loading');
            cy.getByTestId('create-task-modal').within(() => {
                getAssigneeField()
                    .type(username)
                    .trigger('keydown', { code: 'ArrowDown', which: 40 });
                cy.getByTestId('task-assignee-option').click();
                getMessageField().type('valid e2e task');

                getSubmitButton().click();
            });

            // submit button should be in loading state
            getSubmitButton().should('have.class', 'is-loading');

            // wait for task creation request to finish
            cy.wait('@createTaskLink');

            // test environment task create fails with default token, so an
            // inline error should appear in the form
            cy.getByTestId('create-task-modal').within(() => {
                cy.contains('An error occurred while creating this task.').should('exist');
            });
        });
    });
});
