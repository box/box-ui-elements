/**
 * @flow
 * @file CompletedAssignment component
 */

import React from 'react';
import type { Node } from 'react';
import { FormattedMessage } from 'react-intl';

import IconCheck from 'box-react-ui/lib/icons/general/IconCheck';

import messages from '../../../messages';

type Props = {
    name: string
};

const CompletedAssignment = ({ name }: Props): Node => (
    <div className='bcs-task-completed-assignment'>
        <div className='bcs-task-assignment-name'>{name}</div>
        <div className='bcs-task-assignment-actions'>
            <IconCheck
                className='bcs-task-check-icon'
                height={18}
                title={<FormattedMessage {...messages.completedAssignment} />}
                width={18}
            />
        </div>
    </div>
);

export default CompletedAssignment;
