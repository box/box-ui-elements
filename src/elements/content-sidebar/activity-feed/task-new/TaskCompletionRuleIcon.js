// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { TASK_COMPLETION_RULE_ANY } from '../../../../constants';
import messages from './messages';
import Tooltip from '../../../../components/tooltip';
// $FlowFixMe LabelPill is in typescript
import LabelPill from '../../../../components/label-pill';

import Avatar16 from '../../../../icon/line/Avatar16';
import type { TaskCompletionRule } from '../../../../common/types/tasks';

import './TaskCompletionRuleIcon.scss';

type Props = {|
    completionRule: ?TaskCompletionRule,
|};

const TaskCompletionRuleIcon = ({ completionRule }: Props): React.Node =>
    completionRule === TASK_COMPLETION_RULE_ANY && (
        <span className="bcs-TaskCompletionRuleIcon">
            <Tooltip position="top-center" text={<FormattedMessage {...messages.taskAnyAffordanceTooltip} />}>
                <LabelPill.Pill>
                    <LabelPill.Icon Component={Avatar16} />
                    <span>1</span>
                </LabelPill.Pill>
            </Tooltip>
        </span>
    );

export default TaskCompletionRuleIcon;
