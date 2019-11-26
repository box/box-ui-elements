import React from 'react';
import { shallow } from 'enzyme';
import TaskModal from '../TaskModal';

describe('elements/content-sidebar/TaskModal', () => {
    const getWrapper = props => {
        return shallow(
            <TaskModal
                feedbackUrl="http://example.dentist/"
                onSubmitError={jest.fn()}
                onSubmitSuccess={jest.fn()}
                onModalClose={jest.fn()}
                isTaskFormOpen
                taskFormProps={{
                    approverSelectorContacts: null,
                    createTask: jest.fn(),
                    getAvatarUrl: jest.fn(),
                }}
                {...props}
            />,
        );
    };
    describe('render', () => {
        test('should render a default component with default props', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        test.each([
            ['GENERAL', 'CREATE'],
            ['GENERAL', 'EDIT'],
            ['APPROVAL', 'CREATE'],
            ['APPROVAL', 'EDIT'],
        ])('using type %s and mode %s yields the proper modal title', (taskType, editMode) => {
            const wrapper = getWrapper({ taskType, editMode });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
