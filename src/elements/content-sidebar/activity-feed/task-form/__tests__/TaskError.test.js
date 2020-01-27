import * as React from 'react';
import { mount } from 'enzyme';

import TaskError from '../TaskError';

describe('components/content-sidebar/activity-feed/task-form/TaskError', () => {
    test.each([
        ['GENERAL', 'EDIT', undefined, 0],
        ['GENERAL', 'EDIT', { status: 403 }, 1],
        ['GENERAL', 'EDIT', { status: 404 }, 1],
        ['GENERAL', 'CREATE', undefined, 0],
        ['GENERAL', 'CREATE', { status: 403 }, 1],
        ['GENERAL', 'CREATE', { status: 404 }, 1],
        ['APPROVAL', 'EDIT', undefined, 0],
        ['APPROVAL', 'EDIT', { status: 403 }, 1],
        ['APPROVAL', 'EDIT', { status: 404 }, 1],
        ['APPROVAL', 'CREATE', undefined, 0],
        ['APPROVAL', 'CREATE', { status: 403 }, 1],
        ['APPROVAL', 'CREATE', { status: 404 }, 1],
        ['GENERAL', 'CREATE', { code: 'group_exceeds_limit' }, 1],
    ])(
        'when type is %s and edit mode is %s, with error obj %o, we show the proper inline error',
        (taskType, editMode, error) => {
            const wrapper = mount(<TaskError taskType={taskType} editMode={editMode} error={error} />);
            expect(wrapper).toMatchSnapshot();
        },
    );
});
