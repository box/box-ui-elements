/**
 * @flow
 * @file Version component
 */

import React, { ReactNode } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PlainButton from 'box-react-ui/lib/components/plain-button';
import IconInfoInverted from 'box-react-ui/lib/icons/general/IconInfoInverted';

import messages from '../../../messages';
import { User } from '../../../../flowTypes';

import './Version.scss';

function getMessageForAction(name: ReactNode, action: string, versionNumber: string): ReactNode {
    switch (action) {
        case 'upload':
            return (
                <FormattedMessage
                    {...messages.versionUploaded}
                    values={{
                        name: <strong>{name}</strong>,
                        versionNumber
                    }}
                />
            );
        case 'delete':
            return (
                <FormattedMessage
                    {...messages.versionDeleted}
                    values={{
                        name: <strong>{name}</strong>,
                        versionNumber
                    }}
                />
            );
        case 'restore':
            return (
                <FormattedMessage
                    {...messages.versionRestored}
                    values={{
                        name: <strong>{name}</strong>,
                        versionNumber
                    }}
                />
            );
        default:
            return null;
    }
}

type Props = {
    action: 'delete' | 'restore' | 'upload',
    createdBy: User,
    id: string,
    intl: intlShape.isRequired,
    onInfo: Function,
    versionNumber: number
};

const Version = ({ action, createdBy, id, intl, onInfo, versionNumber }: Props): ReactNode => (
    <div className='bcs-version'>
        <span className='bcs-version-message'>{getMessageForAction(createdBy.name, action, versionNumber)}</span>
        {onInfo ? (
            <span className='bcs-version-actions'>
                <PlainButton
                    aria-label={intl.formatMessage(messages.getVersionInfo)}
                    className='bcs-version-info'
                    onClick={() => {
                        onInfo({ id, versionNumber });
                    }}
                    type='button'
                >
                    <IconInfoInverted height={16} width={16} />
                </PlainButton>
            </span>
        ) : null}
    </div>
);

Version.displayName = 'Version';

export { Version as VersionBase };
export default injectIntl(Version);
