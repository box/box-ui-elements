// @flow
import * as React from 'react';
import { render, mount } from 'enzyme';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_NOT_STARTED } from '../../../../../constants';

import AssigneeDetails from '../AssigneeDetails';

const MOCK_USER = {
    id: '123',
    name: 'user one',
};

const MOCK_DATE = new Date('2019-01-01');
const MOCK_DATE_STRING = '2019-01-01T00:00:000Z';

describe('elements/content-sidebar/ActivityFeed/task-new/AssigneeDetails', () => {
    test.each`
        status                  | completedAt
        ${TASK_NEW_APPROVED}    | ${MOCK_DATE_STRING}
        ${TASK_NEW_REJECTED}    | ${MOCK_DATE_STRING}
        ${TASK_NEW_NOT_STARTED} | ${MOCK_DATE_STRING}
        ${'invalid_string'}     | ${MOCK_DATE_STRING}
        ${TASK_NEW_APPROVED}    | ${MOCK_DATE}
        ${null}                 | ${MOCK_DATE}
    `('should render details for status $status', ({ status, completedAt }) => {
        const wrapper = mount(<AssigneeDetails status={status} user={MOCK_USER} completedAt={completedAt} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should add className prop to wrapper div', () => {
        const mockClassName = 'some-class';
        const wrapper = render(
            <AssigneeDetails
                status={TASK_NEW_APPROVED}
                user={MOCK_USER}
                completedAt={MOCK_DATE}
                className={mockClassName}
            />,
        );
        expect(wrapper.hasClass(mockClassName)).toBe(true);
    });
});
