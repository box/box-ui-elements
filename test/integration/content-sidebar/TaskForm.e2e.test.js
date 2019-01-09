// <reference types="Cypress" />
import { localize as l } from '../../support/i18n';

describe('Create Task', () => {
    const getAssigneeField = opts => cy.getByLabelText(l('be.tasks.addTaskForm.assigneesLabel'), opts);
    const getMessageField = opts => cy.getByLabelText(l('be.tasks.addTaskForm.messageLabel'), opts);
    const getSubmitButton = opts => cy.getByTestId('task-form-submit-button', opts);
    const getCancelButton = opts => cy.getByTestId('task-form-cancel-button', opts);
    const username = 'Platform ';

    beforeEach(() => {
        cy.visit('/ContentSidebar'); // Open sidebar example page
        cy.getByTestId('sidebaractivity').click(); // Open activity tab
    });

    context('Add Task button', () => {
        it('opens task form', () => {
            cy.getByText(l('be.tasks.addTask')).click();
            cy.getByTestId('create-task-modal').within(() => {
                cy.getByText(l('be.tasks.addTaskForm.title')).should('exist');
                getSubmitButton().should('exist');
                getCancelButton().should('exist');
            });
        });
    });

    context('Task Form', () => {
        beforeEach(() => {
            cy.getByText(l('be.tasks.addTask')).click();
        });
        it('does not allow submitting form without input', () => {
            getMessageField()
                .type('...')
                .clear();
            cy.getByText('Required Field').should('exist');
        });

        it('creates task if form is filled out', () => {
            cy.getByTestId('create-task-modal').within(form => {
                getAssigneeField({ container: form })
                    .type(username)
                    .trigger('keydown', { code: 'ArrowDown', which: 40 });
                cy.getByTestId('task-assignee-option').click();
                getMessageField({ container: form }).type('valid e2e task');

                getSubmitButton({ container: form }).click();
            });

            // modal should close
            cy.queryByTestId('create-task-modal').should('be.null');

            // validate task appears in feed
            // note that in the test environment task create fails with default token
            // but the card temporarily appears
            cy.getByTestId('activityfeed').within(() => {
                cy.getByTestId('task-card')
                    .last()
                    .within(() => {
                        cy.getByText('valid e2e task').should('exist');
                    });
            });
        });
    });
});
