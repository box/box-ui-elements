// @flow
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';

import Button from '../../../components/button/Button';
import Flyout from '../../../components/flyout/Flyout';
import Overlay from '../../../components/flyout/Overlay';

import SharedLink from '../SharedLink';
import notes from './SharedLink.stories.md';

export const basic = () => {
    const [accessLevel, setAccessLevel] = React.useState('peopleInYourCompany');
    const [submitting, setSubmitting] = React.useState(false);

    const fakeRequest = () => {
        setSubmitting(true);
        return new Promise(resolve => {
            setTimeout(() => {
                setSubmitting(false);
                resolve();
            }, 500);
        });
    };

    return (
        <Flyout
            className="shared-link-flyout"
            closeOnClick={false}
            constrainToScrollParent={false}
            constrainToWindow
            portaledClasses={['modal', 'share-access-menu']}
            position="bottom-right"
        >
            <Button>Shared Link Flyout</Button>
            <Overlay style={{ width: '300px' }}>
                <SharedLink
                    accessDropdownMenuProps={{ constrainToWindow: true }}
                    accessLevel={accessLevel}
                    accessMenuButtonProps={{ 'data-resin-target': 'changepermissions' }}
                    allowedAccessLevels={{
                        peopleWithTheLink: true,
                        peopleInYourCompany: true,
                        peopleInThisItem: true,
                    }}
                    canRemoveLink
                    changeAccessLevel={newLevel => fakeRequest().then(() => setAccessLevel(newLevel))}
                    copyButtonProps={{ 'data-resin-target': 'copy' }}
                    enterpriseName="Box"
                    isDownloadAllowed
                    isEditAllowed
                    isPreviewAllowed
                    itemType="folder"
                    onSettingsClick={() => null}
                    removeLink={fakeRequest}
                    removeLinkButtonProps={{ 'data-resin-target': 'remove' }}
                    settingsButtonProps={{ 'data-resin-target': 'settings' }}
                    sharedLink="http://box.com/s/abcdefg"
                    submitting={submitting}
                />
            </Overlay>
        </Flyout>
    );
};

export default {
    title: 'Features/SharedLink',
    component: SharedLink,
    parameters: {
        notes,
    },
};
