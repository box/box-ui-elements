/**
 * @flow
 * @file RejectedAssignment component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import IconClose from '../../../../icons/general/IconClose';

import messages from './messages';

type Props = {
    name: string,
};

const RejectedAssignment = ({ name }: Props): React.Node => (
    <div className="bcs-task-rejected-assignment">
        <div className="bcs-task-assignment-name">{name}</div>
        <div className="bcs-task-assignment-actions">
            <IconClose
                className="bcs-task-x-icon"
                height={18}
                title={<FormattedMessage {...messages.rejectedAssignment} />}
                width={18}
            />
        </div>
    </div>
);

export default RejectedAssignment;
