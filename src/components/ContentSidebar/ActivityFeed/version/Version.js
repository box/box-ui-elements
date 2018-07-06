/**
 * @flow
 * @file Version component
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import PlainButton from 'box-react-ui/lib/components/plain-button';
import IconInfoInverted from 'box-react-ui/lib/icons/general/IconInfoInverted';

import messages from '../../../messages';

import './Version.scss';

function getMessageForAction(name: React.Node, action: string, version_number: number): React.Node {
    switch (action) {
        case 'upload':
            return (
                <FormattedMessage
                    {...messages.versionUploaded}
                    values={{
                        name: <strong>{name}</strong>,
                        version_number
                    }}
                />
            );
        case 'delete':
            return (
                <FormattedMessage
                    {...messages.versionDeleted}
                    values={{
                        name: <strong>{name}</strong>,
                        version_number
                    }}
                />
            );
        case 'restore':
            return (
                <FormattedMessage
                    {...messages.versionRestored}
                    values={{
                        name: <strong>{name}</strong>,
                        version_number
                    }}
                />
            );
        default:
            return null;
    }
}

type Props = {
    action: 'delete' | 'restore' | 'upload',
    modified_by: User,
    id: string,
    intl: any,
    onInfo?: Function,
    version_number: number
};

const Version = ({ action, modified_by, id, intl, onInfo, version_number }: Props): React.Node => (
    <div className='bcs-version'>
        <span className='bcs-version-message'>{getMessageForAction(modified_by.name, action, version_number)}</span>
        {onInfo ? (
            <span className='bcs-version-actions'>
                <PlainButton
                    aria-label={intl.formatMessage(messages.getVersionInfo)}
                    className='bcs-version-info'
                    onClick={() => {
                        onInfo({ id, version_number });
                    }}
                    type='button'
                >
                    <IconInfoInverted height={16} width={16} />
                </PlainButton>
            </span>
        ) : null}
    </div>
);

export { Version as VersionBase };
export default injectIntl(Version);
