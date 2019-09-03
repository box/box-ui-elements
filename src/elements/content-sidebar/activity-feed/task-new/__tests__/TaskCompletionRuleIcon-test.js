import * as React from 'react';
import { mount } from 'enzyme';
import { TASK_COMPLETION_RULE_ALL, TASK_COMPLETION_RULE_ANY, TASK_NEW_IN_PROGRESS } from '../../../../../constants';
import IconAnyTask from '../../../../../icons/general/IconAnyTask';
import TaskCompletionRuleIcon from '../TaskCompletionRuleIcon';

const getWrapper = props => mount(<TaskCompletionRuleIcon {...props} />);

describe('elements/content-sidebar/ActivityFeed/task-new/TaskCompletionRuleIcon', () => {
    test.each`
        completionRule              | iconLength
        ${TASK_COMPLETION_RULE_ALL} | ${0}
        ${TASK_COMPLETION_RULE_ANY} | ${1}
        ${null}                     | ${0}
    `('should render the completion icon correctly', ({ completionRule, iconLength }) => {
        const wrapper = getWrapper({
            status: TASK_NEW_IN_PROGRESS,
            completionRule,
        });

        expect(wrapper.find(IconAnyTask).length).toBe(iconLength);
    });
});
