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
            cy.contains(l('be.contentSidebar.addTask')).click();
            cy.contains(l('be.contentSidebar.addTask.approval')).click();
            cy.getByTestId('create-task-modal').within(() => {
                cy.contains(l('be.contentSidebar.addTask.approval.title')).should('exist');
                getSubmitButton().should('exist');
                getCancelButton().should('exist');
            });
        });
    });

    context('Task Modal', () => {
        it('autofocuses first input (assignees)', () => {
            cy.contains(l('be.contentSidebar.addTask')).click();
            cy.contains(l('be.contentSidebar.addTask.approval')).click();
            cy.focused().should('have.attr', 'data-testid', 'task-form-assignee-input');
        });
    });

    context('Task Form', () => {
        beforeEach(() => {
            cy.server();
            cy.contains(l('be.contentSidebar.addTask')).click();
            cy.contains(l('be.contentSidebar.addTask.approval')).click();
        });
        it('does not allow submitting form without input', () => {
            getMessageField()
                .type('...')
                .clear();
            cy.contains('Required Field').should('exist');
        });

        it('should not show approver options after reopening form', () => {
            getAssigneeField().type(username);

            cy.getByTestId('task-assignee-option').should('exist');

            // close modal
            getCancelButton().click();

            // reopen modal
            cy.contains(l('be.contentSidebar.addTask')).click();
            cy.contains(l('be.contentSidebar.addTask.approval')).click();

            cy.getByTestId('task-assignee-option').should('not.exist');
        });

        it('shows error state after receiving server error', () => {
            cy.route('POST', '**/undoc/tasks/with_dependencies').as('createTaskWithDeps');
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
            cy.wait('@createTaskWithDeps');

            // test environment task create fails with default token, so an
            // inline error should appear in the form
            cy.getByTestId('create-task-modal').within(() => {
                cy.contains('An error occurred while creating this task.').should('exist');
            });
        });
    });
});
