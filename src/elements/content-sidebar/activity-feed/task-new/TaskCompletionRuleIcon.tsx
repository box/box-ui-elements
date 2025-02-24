import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { TASK_COMPLETION_RULE_ANY } from '../../../../constants';
import messages from './messages';
import LabelPill from '../../../../components/label-pill';
import Tooltip from '../../../../components/tooltip';
import Avatar16 from '../../../../icon/line/Avatar16';
import type { TaskCompletionRule } from '../../../../common/types/tasks';

import './TaskCompletionRuleIcon.scss';

interface TaskCompletionRuleIconProps {
    completionRule: TaskCompletionRule | undefined;
}

const TaskCompletionRuleIcon = ({ completionRule }: TaskCompletionRuleIconProps): JSX.Element | null =>
    completionRule === TASK_COMPLETION_RULE_ANY && (
        <span className="bcs-TaskCompletionRuleIcon">
            <Tooltip position="top-center" text={<FormattedMessage {...messages.taskAnyAffordanceTooltip} />}>
                <LabelPill.Pill>
                    <LabelPill.Icon Component={Avatar16} />
                    <LabelPill.Text className="bcs-TaskCompletionRuleIcon-oneSize">1</LabelPill.Text>
                </LabelPill.Pill>
            </Tooltip>
        </span>
    );

export default TaskCompletionRuleIcon;
