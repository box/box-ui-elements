// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { State, Store } from '@sambego/storybook-state';
import { boolean } from '@storybook/addon-knobs';

import Button from '../../../components/button/Button';
import Flyout from '../../../components/flyout/Flyout';
import Overlay from '../../../components/flyout/Overlay';

import SharedLink from '../SharedLink';
import notes from './SharedLink.stories.md';

export const basic = () => {
    const componentStore = new Store({
        accessLevel: 'peopleInYourCompany',
        submitting: false,
    });

    const fakeRequest = () => {
        componentStore.set({ submitting: true });
        return new Promise(resolve => {
            setTimeout(() => {
                componentStore.set({ submitting: false });
                resolve();
            }, 500);
        });
    };

    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en">
                    <Flyout
                        className="shared-link-flyout"
                        closeOnClick={boolean('closeOnClick', false)}
                        constrainToScrollParent={boolean('constrainToScrollParent', false)}
                        constrainToWindow={boolean('constrainToWindow', true)}
                        portaledClasses={['modal', 'share-access-menu']}
                        position="bottom-right"
                    >
                        <Button>Shared Link Flyout</Button>
                        <Overlay style={{ width: '300px' }}>
                            <SharedLink
                                accessDropdownMenuProps={{ constrainToWindow: true }}
                                accessLevel={state.accessLevel}
                                accessMenuButtonProps={{ 'data-resin-target': 'changepermissions' }}
                                allowedAccessLevels={{
                                    peopleWithTheLink: true,
                                    peopleInYourCompany: true,
                                    peopleInThisItem: true,
                                }}
                                canRemoveLink={boolean('canRemoveLink', true)}
                                changeAccessLevel={newLevel =>
                                    fakeRequest().then(() => componentStore.set({ accessLevel: newLevel }))
                                }
                                copyButtonProps={{ 'data-resin-target': 'copy' }}
                                enterpriseName="Box"
                                isDownloadAllowed={boolean('isDownloadAllowed', true)}
                                isEditAllowed={boolean('isEditAllowed', true)}
                                isPreviewAllowed={boolean('isPreviewAllowed', true)}
                                itemType="folder"
                                onSettingsClick={() => null}
                                removeLink={fakeRequest}
                                removeLinkButtonProps={{ 'data-resin-target': 'remove' }}
                                settingsButtonProps={{ 'data-resin-target': 'settings' }}
                                sharedLink="http://box.com/s/abcdefg"
                                submitting={state.submitting}
                            />
                        </Overlay>
                    </Flyout>
                </IntlProvider>
            )}
        </State>
    );
};

export default {
    title: 'Features|SharedLink',
    component: SharedLink,
    parameters: {
        notes,
    },
};
