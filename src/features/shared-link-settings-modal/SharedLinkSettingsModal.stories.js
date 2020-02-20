// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { State, Store } from '@sambego/storybook-state';
import { boolean } from '@storybook/addon-knobs';

import Button from '../../components/button/Button';

import SharedLinkSettingsModal from './SharedLinkSettingsModal';
import notes from './SharedLinkSettingsModal.stories.md';

export const basic = () => {
    const componentStore = new Store({
        isOpen: false,
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
                    <div>
                        {state.isOpen && (
                            <SharedLinkSettingsModal
                                accessLevel="peopleWithTheLink"
                                canChangeVanityName
                                item={{
                                    bannerPolicy: {
                                        body: 'test',
                                    },
                                    classification: 'internal',
                                    grantedPermissions: {
                                        itemShare: true,
                                    },
                                    hideCollaborators: false,
                                    id: 12345,
                                    name: 'My Example Folder',
                                    type: 'folder',
                                    typedID: 'd_12345',
                                }}
                                isOpen
                                onRequestClose={() => componentStore.set({ isOpen: false })}
                                onSubmit={fakeRequest}
                                serverURL="https://box.com/v/"
                                submitting={state.submitting}
                                vanityName="vanity"
                                canChangePassword
                                isPasswordAvailable
                                isPasswordEnabled={boolean('isPasswordEnabled', false)}
                                canChangeExpiration
                                isDownloadAvailable
                                canChangeDownload
                                isDownloadEnabled={boolean('isDownloadEnabled', false)}
                                directLink="https://box.com/download/path"
                                isDirectLinkAvailable
                                isDirectLinkUnavailableDueToDownloadSettings={boolean(
                                    'isDirectLinkUnavailableDueToDownloadSettings',
                                    false,
                                )}
                                isDirectLinkUnavailableDueToAccessPolicy
                                vanityNameInputProps={{ 'data-resin-target': 'test' }}
                                passwordCheckboxProps={{ 'data-resin-target': 'test' }}
                                passwordInputProps={{ 'data-resin-target': 'test' }}
                                expirationCheckboxProps={{ 'data-resin-target': 'test' }}
                                expirationInputProps={{ 'data-resin-target': 'test' }}
                                downloadCheckboxProps={{ 'data-resin-target': 'test' }}
                                directLinkInputProps={{ 'data-resin-target': 'test' }}
                                saveButtonProps={{ 'data-resin-target': 'test' }}
                                cancelButtonProps={{ 'data-resin-target': 'test' }}
                                modalProps={{ 'data-resin-feature': 'test' }}
                                warnOnPublic={state.isPublic}
                            />
                        )}
                        <Button onClick={() => componentStore.set({ isOpen: true })}>Shared Link Settings Modal</Button>
                    </div>
                </IntlProvider>
            )}
        </State>
    );
};

export default {
    title: 'Features|SharedLinkSettingsModal',
    component: SharedLinkSettingsModal,
    parameters: {
        notes,
    },
};
