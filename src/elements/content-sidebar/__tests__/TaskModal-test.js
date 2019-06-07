import React from 'react';
import { shallow } from 'enzyme';
import TaskModal from '../TaskModal';

describe('elements/content-sidebar/TaskModal', () => {
    describe('render', () => {
        test('should render a default component with default props', () => {
            const wrapper = shallow(
                <TaskModal
                    feedbackUrl="http://example.dentist/"
                    handleCreateError={jest.fn()}
                    handleCreateSuccess={jest.fn()}
                    handleModalClose={jest.fn()}
                    isTaskFormOpen
                    taskFormProps={{
                        approverSelectorContacts: null,
                        createTask: jest.fn(),
                        getAvatarUrl: jest.fn(),
                    }}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });
    });
});
