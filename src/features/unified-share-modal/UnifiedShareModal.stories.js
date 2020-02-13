// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { State, Store } from '@sambego/storybook-state';
import { boolean } from '@storybook/addon-knobs';
import Button from '../../components/button/Button';

import UnifiedShareModal from './UnifiedShareModal';
import notes from './UnifiedShareModal.stories.md';

// Base Example. Extend for different initial loads or to demonstrate different interactions
const DEFAULT_SHARED_LINK_STATE = {
    accessLevel: '',
    allowedAccessLevels: {},
    canChangeAccessLevel: true,
    enterpriseName: '',
    expirationTimestamp: null,
    isDownloadSettingAvailable: true,
    isNewSharedLink: false,
    permissionLevel: '',
    url: '',
};

const INITIAL_STATE = {
    isOpen: false,
    item: {
        bannerPolicy: {
            body: 'test',
        },
        canUserSeeClassification: true,
        classification: 'internal',
        grantedPermissions: {
            itemShare: true,
        },
        hideCollaborators: false,
        id: 12345,
        name: 'My Example Folder',
        type: 'folder',
        typedID: 'd_12345',
    },
    collaboratorsList: {
        collaborators: [],
    },
    selectorOptions: [],
    sharedLink: DEFAULT_SHARED_LINK_STATE,
    submitting: false,
};

const contacts = [
    {
        id: 0,
        collabID: 0,
        name: 'Jackie',
        email: 'j@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Owner',
        userID: '0',
        profileURL: 'https://foo.bar',
        isExternalUser: false,
    },
    {
        id: 1,
        collabID: 1,
        name: 'Jeff',
        email: 'jt@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Viewer',
        userID: '1',
        isExternalUser: true,
    },
    {
        id: 2,
        collabID: 2,
        name: 'David',
        email: 'dt@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '2',
        isExternalUser: false,
    },
    {
        id: 3,
        collabID: 3,
        name: 'Yang',
        email: 'yz@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '3',
        isExternalUser: true,
    },
    {
        id: 4,
        collabID: 4,
        name: 'Yong',
        email: 'ysu@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '4',
        isExternalUser: false,
    },
    {
        id: 5,
        collabID: 5,
        name: 'Will',
        email: 'wy@example.com',
        type: 'pending',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '5',
    },
    {
        id: 6,
        collabID: 6,
        name: 'Dave',
        email: 'd@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '6',
    },
    {
        id: 7,
        collabID: 7,
        name: 'Ke',
        email: 'k@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '7',
    },
    {
        id: 8,
        collabID: 8,
        name: 'Wenbo',
        email: 'w@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '8',
    },
    {
        id: 11,
        collabID: 11,
        name: 'Supersupersupersuperreallyreallyreallylongfirstname incrediblyspectacularlylonglastname',
        email: 'Supersupersupersuperreallyreallyreallyincrediblyspectacularlylongemail@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '11',
    },
    {
        id: 12,
        collabID: 12,
        name: 'Aaron Levie',
        email: 'a@example.com',
        type: 'user',
        hasCustomAvatar: true,
        avatarURLs: {
            small:
                'data:image/jpeg;base64,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',
            large:
                'data:image/jpeg;base64,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',
        },
        translatedRole: 'Editor',
        userID: '12',
    },
    {
        id: 13,
        collabID: 13,
        name: 'Not Aaron',
        email: 'na@example.com',
        type: 'user',
        hasCustomAvatar: true,
        avatarURLs: {
            small:
                'data:image/jpeg;base64,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',
            large:
                'data:image/jpeg;base64,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',
        },
        translatedRole: 'Editor',
        userID: '13',
        isExternalUser: true,
    },
    {
        /* example group contact */
        id: 14,
        collabID: 14,
        type: 'group',
        name: 'my group',
        hasCustomAvatar: false,
        translatedRole: 'Viewer',
        userID: null,
    },
];

const createComponentStore = () => new Store(INITIAL_STATE);

export const basic = () => {
    const componentStore = createComponentStore();

    const closeModal = () => {
        componentStore.set({
            isOpen: false,
            sharedLink: DEFAULT_SHARED_LINK_STATE,
            collaboratorsList: {
                collaborators: [],
            },
        });
    };

    const fakeRequest = () => {
        // submitting is used to disable input fields, and not to show the loading indicator
        componentStore.set({ submitting: true });
        return new Promise(resolve => {
            setTimeout(() => {
                componentStore.set({ submitting: false });
                resolve();
            }, 500);
        });
    };

    const getInitialData = () => {
        const initialPromise = fakeRequest();
        const fetchCollaborators = new Promise(resolved => {
            setTimeout(() => {
                const collaborators = contacts.slice();

                const collaboratorsList = {
                    collaborators,
                };
                componentStore.set({ collaboratorsList });
                resolved();
            }, 1000);
        });
        return Promise.all([initialPromise, fetchCollaborators]);
    };

    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en">
                    <div>
                        {state.isOpen && (
                            <UnifiedShareModal
                                canInvite
                                changeSharedLinkAccessLevel={newLevel => {
                                    return fakeRequest().then(() => {
                                        return componentStore.set({
                                            sharedLink: {
                                                ...state.sharedLink,
                                                accessLevel: newLevel,
                                            },
                                        });
                                    });
                                }}
                                changeSharedLinkPermissionLevel={newLevel => {
                                    return fakeRequest().then(() => {
                                        return componentStore.set({
                                            sharedLink: {
                                                ...state.sharedLink,
                                                permissionLevel: newLevel,
                                            },
                                        });
                                    });
                                }}
                                collaboratorsList={state.collaboratorsList}
                                collaborationRestrictionWarning="Collaboration invitations can only be sent to people within Box Corporate"
                                currentUserID="0"
                                getCollaboratorContacts={() => {
                                    return Promise.resolve(contacts);
                                }}
                                getSharedLinkContacts={() => {
                                    return Promise.resolve(contacts);
                                }}
                                getInitialData={getInitialData}
                                inviteePermissions={[
                                    { default: false, text: 'Co-owner', value: 'Co-owner' },
                                    { default: true, text: 'Editor', value: 'Editor' },
                                    { default: false, text: 'Viewer Uploader', value: 'Viewer Uploader' },
                                    { default: false, text: 'Previewer Uploader', value: 'Previewer Uploader' },
                                    { default: false, text: 'Viewer', value: 'Viewer' },
                                    { default: false, text: 'Previewer', value: 'Previewer' },
                                    { default: false, text: 'Uploader', value: 'Uploader' },
                                ]}
                                isOpen={state.isOpen}
                                isToggleEnabled
                                item={state.item}
                                onAddLink={() => {
                                    fakeRequest().then(() => {
                                        componentStore.set({
                                            sharedLink: {
                                                accessLevel: 'peopleInYourCompany',
                                                allowedAccessLevels: {
                                                    peopleWithTheLink: true,
                                                    peopleInYourCompany: true,
                                                    peopleInThisItem: true,
                                                },
                                                canChangeAccessLevel: true,
                                                enterpriseName: 'Box',
                                                expirationTimestamp: 1509173940,
                                                isDownloadSettingAvailable: true,
                                                isNewSharedLink: true,
                                                permissionLevel: 'canViewDownload',
                                                url: 'https://box.com/s/abcdefg',
                                            },
                                        });
                                    });
                                }}
                                onRemoveLink={() => {
                                    fakeRequest().then(() => {
                                        componentStore.set({
                                            sharedLink: DEFAULT_SHARED_LINK_STATE,
                                        });
                                        closeModal();
                                    });
                                }}
                                onRequestClose={closeModal}
                                /* eslint-disable-next-line no-alert */
                                onSettingsClick={() => alert('hi!')}
                                recommendedSharingTooltipCalloutName=""
                                sendInvites={() =>
                                    fakeRequest().then(() => {
                                        closeModal();
                                    })
                                }
                                sendInvitesError=""
                                sendSharedLink={() =>
                                    fakeRequest().then(() => {
                                        closeModal();
                                    })
                                }
                                sendSharedLinkError=""
                                sharedLink={state.sharedLink}
                                showCalloutForUser
                                showInviteeAvatars={boolean('showInviteeAvatars', false)}
                                showUpgradeOptions
                                submitting={state.submitting}
                                suggestedCollaborators={{
                                    '2': { id: '2', userScore: 0.1 },
                                    '5': { id: '5', userScore: 0.2 },
                                    '1': { id: '1', userScore: 0.5 },
                                    '3': { id: '3', userScore: 2 },
                                }}
                                trackingProps={{
                                    collaboratorListTracking: {},
                                    inviteCollabsEmailTracking: {},
                                    inviteCollabTracking: {},
                                    modalTracking: {},
                                    removeLinkConfirmModalTracking: {},
                                    sharedLinkEmailTracking: {},
                                    sharedLinkTracking: {},
                                }}
                            />
                        )}
                        <Button
                            onClick={() =>
                                componentStore.set({
                                    isOpen: true,
                                })
                            }
                        >
                            Open USM Modal
                        </Button>
                    </div>
                </IntlProvider>
            )}
        </State>
    );
};

export const withSharedLink = () => {
    const componentStore = createComponentStore();

    const closeModal = () => {
        componentStore.set({
            isOpen: false,
            sharedLink: DEFAULT_SHARED_LINK_STATE,
            collaboratorsList: {
                collaborators: [],
            },
        });
    };

    const fakeRequest = () => {
        // submitting is used to disable input fields, and not to show the loading indicator
        componentStore.set({ submitting: true });
        return new Promise(resolve => {
            setTimeout(() => {
                componentStore.set({ submitting: false });
                resolve();
            }, 500);
        });
    };

    const getInitialData = () => {
        const resolveSharedLink = new Promise(resolved => {
            setTimeout(() => {
                componentStore.set({
                    sharedLink: {
                        accessLevel: 'peopleInYourCompany',
                        allowedAccessLevels: {
                            peopleWithTheLink: true,
                            peopleInYourCompany: true,
                            peopleInThisItem: true,
                        },
                        canChangeAccessLevel: true,
                        enterpriseName: 'Box',
                        expirationTimestamp: 1509173940,
                        isDownloadSettingAvailable: true,
                        permissionLevel: 'canViewDownload',
                        url: 'https://box.com/s/abcdefg',
                    },
                });
                resolved();
            }, 400);
        });

        return Promise.all([fakeRequest, resolveSharedLink]);
    };

    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en">
                    <div>
                        {state.isOpen && (
                            <UnifiedShareModal
                                canInvite
                                changeSharedLinkAccessLevel={newLevel => {
                                    return fakeRequest().then(() => {
                                        return componentStore.set({
                                            sharedLink: {
                                                ...state.sharedLink,
                                                accessLevel: newLevel,
                                            },
                                        });
                                    });
                                }}
                                changeSharedLinkPermissionLevel={newLevel => {
                                    return fakeRequest().then(() => {
                                        return componentStore.set({
                                            sharedLink: {
                                                ...state.sharedLink,
                                                permissionLevel: newLevel,
                                            },
                                        });
                                    });
                                }}
                                collaboratorsList={state.collaboratorsList}
                                collaborationRestrictionWarning="Collaboration invitations can only be sent to people within Box Corporate"
                                currentUserID="0"
                                focusSharedLinkOnLoad={false}
                                getCollaboratorContacts={() => {
                                    return Promise.resolve(contacts);
                                }}
                                getSharedLinkContacts={() => {
                                    return Promise.resolve(contacts);
                                }}
                                getInitialData={getInitialData}
                                inviteePermissions={[
                                    { default: false, text: 'Co-owner', value: 'Co-owner' },
                                    { default: true, text: 'Editor', value: 'Editor' },
                                    { default: false, text: 'Viewer Uploader', value: 'Viewer Uploader' },
                                    { default: false, text: 'Previewer Uploader', value: 'Previewer Uploader' },
                                    { default: false, text: 'Viewer', value: 'Viewer' },
                                    { default: false, text: 'Previewer', value: 'Previewer' },
                                    { default: false, text: 'Uploader', value: 'Uploader' },
                                ]}
                                isOpen={state.isOpen}
                                isToggleEnabled
                                item={state.item}
                                onAddLink={() => {
                                    fakeRequest().then(() => {
                                        componentStore.set({
                                            sharedLink: {
                                                accessLevel: 'peopleInYourCompany',
                                                allowedAccessLevels: {
                                                    peopleWithTheLink: true,
                                                    peopleInYourCompany: true,
                                                    peopleInThisItem: true,
                                                },
                                                canChangeAccessLevel: true,
                                                enterpriseName: 'Box',
                                                expirationTimestamp: 1509173940,
                                                isDownloadSettingAvailable: true,
                                                isNewSharedLink: true,
                                                permissionLevel: 'canViewDownload',
                                                url: 'https://box.com/s/abcdefg',
                                            },
                                        });
                                    });
                                }}
                                onRemoveLink={() => {
                                    fakeRequest().then(() => {
                                        componentStore.set({
                                            sharedLink: DEFAULT_SHARED_LINK_STATE,
                                        });
                                        closeModal();
                                    });
                                }}
                                onRequestClose={closeModal}
                                /* eslint-disable-next-line no-alert */
                                onSettingsClick={() => alert('hi!')}
                                recommendedSharingTooltipCalloutName=""
                                sendInvites={() =>
                                    fakeRequest().then(() => {
                                        closeModal();
                                    })
                                }
                                sendInvitesError=""
                                sendSharedLink={() =>
                                    fakeRequest().then(() => {
                                        closeModal();
                                    })
                                }
                                sendSharedLinkError=""
                                sharedLink={state.sharedLink}
                                showCalloutForUser
                                showInviteeAvatars={boolean('showInviteeAvatars', false)}
                                showUpgradeOptions
                                submitting={state.submitting}
                                suggestedCollaborators={{
                                    '2': { id: '2', userScore: 0.1 },
                                    '5': { id: '5', userScore: 0.2 },
                                    '1': { id: '1', userScore: 0.5 },
                                    '3': { id: '3', userScore: 2 },
                                }}
                                trackingProps={{
                                    collaboratorListTracking: {},
                                    inviteCollabsEmailTracking: {},
                                    inviteCollabTracking: {},
                                    modalTracking: {},
                                    removeLinkConfirmModalTracking: {},
                                    sharedLinkEmailTracking: {},
                                    sharedLinkTracking: {},
                                }}
                            />
                        )}
                        <Button
                            onClick={() =>
                                componentStore.set({
                                    isOpen: true,
                                })
                            }
                        >
                            Open USM Modal
                        </Button>
                    </div>
                </IntlProvider>
            )}
        </State>
    );
};

export const withAutofocusedSharedLink = () => {
    const componentStore = createComponentStore();

    const closeModal = () => {
        componentStore.set({
            isOpen: false,
            sharedLink: DEFAULT_SHARED_LINK_STATE,
            collaboratorsList: {
                collaborators: [],
            },
        });
    };

    const fakeRequest = () => {
        // submitting is used to disable input fields, and not to show the loading indicator
        componentStore.set({ submitting: true });
        return new Promise(resolve => {
            setTimeout(() => {
                componentStore.set({ submitting: false });
                resolve();
            }, 500);
        });
    };

    const getInitialData = () => {
        const resolveSharedLink = new Promise(resolved => {
            setTimeout(() => {
                componentStore.set({
                    sharedLink: {
                        accessLevel: 'peopleInYourCompany',
                        allowedAccessLevels: {
                            peopleWithTheLink: true,
                            peopleInYourCompany: true,
                            peopleInThisItem: true,
                        },
                        canChangeAccessLevel: true,
                        enterpriseName: 'Box',
                        expirationTimestamp: 1509173940,
                        isDownloadSettingAvailable: true,
                        permissionLevel: 'canViewDownload',
                        url: 'https://box.com/s/abcdefg',
                    },
                });
                resolved();
            }, 400);
        });

        return Promise.all([fakeRequest, resolveSharedLink]);
    };

    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en">
                    <div>
                        {state.isOpen && (
                            <UnifiedShareModal
                                canInvite
                                changeSharedLinkAccessLevel={newLevel => {
                                    return fakeRequest().then(() => {
                                        return componentStore.set({
                                            sharedLink: {
                                                ...state.sharedLink,
                                                accessLevel: newLevel,
                                            },
                                        });
                                    });
                                }}
                                changeSharedLinkPermissionLevel={newLevel => {
                                    return fakeRequest().then(() => {
                                        return componentStore.set({
                                            sharedLink: {
                                                ...state.sharedLink,
                                                permissionLevel: newLevel,
                                            },
                                        });
                                    });
                                }}
                                collaboratorsList={state.collaboratorsList}
                                collaborationRestrictionWarning="Collaboration invitations can only be sent to people within Box Corporate"
                                currentUserID="0"
                                focusSharedLinkOnLoad
                                getCollaboratorContacts={() => {
                                    return Promise.resolve(contacts);
                                }}
                                getSharedLinkContacts={() => {
                                    return Promise.resolve(contacts);
                                }}
                                getInitialData={getInitialData}
                                inviteePermissions={[
                                    { default: false, text: 'Co-owner', value: 'Co-owner' },
                                    { default: true, text: 'Editor', value: 'Editor' },
                                    { default: false, text: 'Viewer Uploader', value: 'Viewer Uploader' },
                                    { default: false, text: 'Previewer Uploader', value: 'Previewer Uploader' },
                                    { default: false, text: 'Viewer', value: 'Viewer' },
                                    { default: false, text: 'Previewer', value: 'Previewer' },
                                    { default: false, text: 'Uploader', value: 'Uploader' },
                                ]}
                                isOpen={state.isOpen}
                                isToggleEnabled
                                item={state.item}
                                onAddLink={() => {
                                    fakeRequest().then(() => {
                                        componentStore.set({
                                            sharedLink: {
                                                accessLevel: 'peopleInYourCompany',
                                                allowedAccessLevels: {
                                                    peopleWithTheLink: true,
                                                    peopleInYourCompany: true,
                                                    peopleInThisItem: true,
                                                },
                                                canChangeAccessLevel: true,
                                                enterpriseName: 'Box',
                                                expirationTimestamp: 1509173940,
                                                isDownloadSettingAvailable: true,
                                                isNewSharedLink: true,
                                                permissionLevel: 'canViewDownload',
                                                url: 'https://box.com/s/abcdefg',
                                            },
                                        });
                                    });
                                }}
                                onRemoveLink={() => {
                                    fakeRequest().then(() => {
                                        componentStore.set({
                                            sharedLink: DEFAULT_SHARED_LINK_STATE,
                                        });
                                        closeModal();
                                    });
                                }}
                                onRequestClose={closeModal}
                                /* eslint-disable-next-line no-alert */
                                onSettingsClick={() => alert('hi!')}
                                recommendedSharingTooltipCalloutName=""
                                sendInvites={() =>
                                    fakeRequest().then(() => {
                                        closeModal();
                                    })
                                }
                                sendInvitesError=""
                                sendSharedLink={() =>
                                    fakeRequest().then(() => {
                                        closeModal();
                                    })
                                }
                                sendSharedLinkError=""
                                sharedLink={state.sharedLink}
                                showCalloutForUser
                                showInviteeAvatars={boolean('showInviteeAvatars', false)}
                                showUpgradeOptions
                                submitting={state.submitting}
                                suggestedCollaborators={{
                                    '2': { id: '2', userScore: 0.1 },
                                    '5': { id: '5', userScore: 0.2 },
                                    '1': { id: '1', userScore: 0.5 },
                                    '3': { id: '3', userScore: 2 },
                                }}
                                trackingProps={{
                                    collaboratorListTracking: {},
                                    inviteCollabsEmailTracking: {},
                                    inviteCollabTracking: {},
                                    modalTracking: {},
                                    removeLinkConfirmModalTracking: {},
                                    sharedLinkEmailTracking: {},
                                    sharedLinkTracking: {},
                                }}
                            />
                        )}
                        <Button
                            onClick={() =>
                                componentStore.set({
                                    isOpen: true,
                                })
                            }
                        >
                            Open USM Modal
                        </Button>
                    </div>
                </IntlProvider>
            )}
        </State>
    );
};

export default {
    title: 'Features|UnifiedShareModal',
    component: UnifiedShareModal,
    parameters: {
        notes,
    },
};
