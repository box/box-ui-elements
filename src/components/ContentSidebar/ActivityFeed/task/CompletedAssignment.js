/**
 * @flow
 * @file CompletedAssignment component
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import IconCheck from 'box-react-ui/lib/icons/general/IconCheck';

import messages from '../messages';

type Props = {
    name: string
};

const CompletedAssignment = ({ name }: Props) => (
    <div className='box-ui-task-completed-assignment'>
        <div className='box-ui-task-assignment-name'>{name}</div>
        <div className='box-ui-task-assignment-actions'>
            <IconCheck
                className='box-ui-task-check-icon'
                height={18}
                title={<FormattedMessage {...messages.completedAssignment} />}
                width={18}
            />
        </div>
    </div>
);

export default CompletedAssignment;
