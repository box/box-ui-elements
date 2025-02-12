// @flow
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';

import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';

import SharedLinkSettingsModal from './SharedLinkSettingsModal';
import notes from './SharedLinkSettingsModal.stories.md';

export const basic = () => {
    const [isOpen, setIsOpen] = React.useState(false);
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
        <div>
            {isOpen && (
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
                    onRequestClose={() => setIsOpen(false)}
                    onSubmit={fakeRequest}
                    serverURL="https://box.com/v/"
                    submitting={submitting}
                    vanityName="vanity"
                    canChangePassword
                    isPasswordAvailable
                    isPasswordEnabled={false}
                    canChangeExpiration
                    isDownloadAvailable
                    canChangeDownload
                    isDownloadEnabled={false}
                    directLink="https://box.com/download/path"
                    isDirectLinkAvailable
                    isDirectLinkUnavailableDueToDownloadSettings={false}
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
                    warnOnPublic={false}
                />
            )}
            <ButtonAdapter onClick={() => setIsOpen(true)} type={ButtonType.BUTTON}>
                Shared Link Settings Modal
            </ButtonAdapter>
        </div>
    );
};

export default {
    title: 'Features/SharedLinkSettingsModal',
    component: SharedLinkSettingsModal,
    parameters: {
        notes,
    },
};
