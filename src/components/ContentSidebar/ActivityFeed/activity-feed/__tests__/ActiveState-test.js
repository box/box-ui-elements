import * as React from 'react';
import { shallow } from 'enzyme';

import ActiveState from '../ActiveState';

const items = [
    {
        type: 'comment',
        id: 123,
        created_at: '2018-07-03T14:43:52-07:00',
        tagged_message: 'test @[123:Jeezy] @[10:Kanye West]',
        created_by: { name: 'Akon', id: 11 }
    },
    {
        type: 'task',
        id: 234,
        created_at: '2018-07-03T14:43:52-07:00',
        created_by: { name: 'Akon', id: 11 },
        modified_at: '2018-07-03T14:43:52-07:00',
        tagged_message: 'test',
        modified_by: { name: 'Jay-Z', id: 10 },
        dueAt: '2018-07-03T14:43:52-07:00',
        task_assignment_collection: {
            entries: [{ assigned_to: { name: 'Akon', id: 11 }, resolution_state: 'incomplete' }],
            total_count: 1
        }
    },
    {
        type: 'file_version',
        id: 345,
        created_at: '2018-07-03T14:43:52-07:00',
        trashed_at: '2018-07-03T14:43:52-07:00',
        modified_at: '2018-07-03T14:43:52-07:00',
        modified_by: { name: 'Akon', id: 11 }
    }
];

const activityFeedError = { title: 't', content: 'm' };

describe('components/ContentSidebar/ActiveState/activity-feed/ActiveState', () => {
    test('should correctly render empty state', () => {
        const wrapper = shallow(<ActiveState items={[]} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render with comments, tasks, versions', () => {
        const wrapper = shallow(<ActiveState items={items} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render with an inline error if some feed items fail to fetch', () => {
        const wrapper = shallow(<ActiveState inlineError={activityFeedError} items={[]} />);
        expect(wrapper).toMatchSnapshot();
    });
});
