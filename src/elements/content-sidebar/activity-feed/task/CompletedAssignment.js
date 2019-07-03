/**
 * @flow
 * @file CompletedAssignment component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import IconCheck from '../../../../icons/general/IconCheck';

import messages from '../task-new/messages';

type Props = {
    name: string,
};

const CompletedAssignment = ({ name }: Props): React.Node => (
    <div className="bcs-task-completed-assignment">
        <div className="bcs-task-assignment-name">{name}</div>
        <div className="bcs-task-assignment-actions">
            <IconCheck
                className="bcs-task-check-icon"
                height={18}
                title={<FormattedMessage {...messages.taskAssignmentCompleted} />}
                width={18}
            />
        </div>
    </div>
);

export default CompletedAssignment;
