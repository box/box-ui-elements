/**
 * @flow
 * @file RejectedAssignment component
 */

import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import IconClose from 'box-react-ui/lib/icons/general/IconClose';

import messages from '../messages';

type Props = {
    name: string
};

const RejectedAssignment = ({ name }: Props): ReactNode => (
    <div className='box-ui-task-rejected-assignment'>
        <div className='box-ui-task-assignment-name'>{name}</div>
        <div className='box-ui-task-assignment-actions'>
            <IconClose
                className='box-ui-task-x-icon'
                height={18}
                title={<FormattedMessage {...messages.rejectedAssignment} />}
                width={18}
            />
        </div>
    </div>
);

export default RejectedAssignment;
