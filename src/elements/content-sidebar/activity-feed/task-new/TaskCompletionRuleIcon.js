// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { TASK_COMPLETION_RULE_ANY } from '../../../../constants';
import messages from './messages';
import Tooltip from '../../../../components/tooltip';
import IconAnyTask from '../../../../icons/general/IconAnyTask';
import type { TaskCompletionRule } from '../../../../common/types/tasks';

type Props = {|
    completionRule: ?TaskCompletionRule,
|};

const TaskCompletionRuleIcon = ({ completionRule }: Props): React.Node => {
    return (
        <React.Fragment>
            {completionRule === TASK_COMPLETION_RULE_ANY ? (
                <Tooltip position="top-center" text={<FormattedMessage {...messages.taskAnyAffordanceTooltip} />}>
                    <span>
                        <IconAnyTask className="bcs-TaskCompletionRuleIcon" />
                    </span>
                </Tooltip>
            ) : null}
        </React.Fragment>
    );
};

export default TaskCompletionRuleIcon;
