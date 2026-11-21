import * as React from 'react';
import { mount } from 'enzyme';
import {
    TASK_NEW_APPROVED,
    TASK_NEW_REJECTED,
    TASK_NEW_COMPLETED,
    TASK_NEW_NOT_STARTED,
    TASK_NEW_IN_PROGRESS,
} from '../../../../../constants';
import TaskStatus from '../TaskStatus';

const getWrapper = props => mount(<TaskStatus {...props} />);

describe('elements/content-sidebar/ActivityFeed/task-new/TaskStatus', () => {
    test.each`
        status
        ${TASK_NEW_APPROVED}
        ${TASK_NEW_REJECTED}
        ${TASK_NEW_COMPLETED}
        ${TASK_NEW_NOT_STARTED}
        ${TASK_NEW_IN_PROGRESS}
    `('should render the correct task status $status', ({ status }) => {
        const wrapper = getWrapper({
            status,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
