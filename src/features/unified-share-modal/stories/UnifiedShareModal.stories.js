// @flow
/* eslint-disable no-console */
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { State, Store } from '@sambego/storybook-state';

import Button from '../../../components/button/Button';

import UnifiedShareModal from '../UnifiedShareModal';
import notes from './UnifiedShareModal.stories.md';
import type { contactType, collaboratorType } from '../flowTypes';
import * as constants from '../constants';

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
    isConfirmModalOpen: false,
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

const contacts: Array<contactType> = [
    {
        id: '0',
        collabID: 0,
        name: 'Jackie',
        email: 'j@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Owner',
        userID: '0',
        profileURL: 'https://foo.bar',
    },
    {
        id: '1',
        collabID: '1',
        name: 'Jeff',
        email: 'jt@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Viewer',
        userID: '1',
    },
    {
        id: '2',
        collabID: '2',
        name: 'David',
        email: 'dt@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '2',
    },
    {
        id: '3',
        collabID: '3',
        name: 'Yang',
        email: 'yz@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '3',
    },
    {
        id: '4',
        collabID: '4',
        name: 'Yong',
        email: 'ysu@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '4',
    },
    {
        id: '5',
        collabID: '5',
        name: 'Will',
        email: 'wy@example.com',
        type: 'pending',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '5',
    },
    {
        id: '6',
        collabID: '6',
        name: 'Dave',
        email: 'd@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '6',
    },
    {
        id: '7',
        collabID: '7',
        name: 'Ke',
        email: 'k@example.com',
        isExternalUser: true,
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '7',
    },
    {
        id: '8',
        collabID: '8',
        name: 'Wenbo',
        email: 'w@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '8',
    },
    {
        id: '11',
        collabID: '11',
        name: 'Supersupersupersuperreallyreallyreallylongfirstname incrediblyspectacularlylonglastname',
        email: 'Supersupersupersuperreallyreallyreallyincrediblyspectacularlylongemail@example.com',
        type: 'user',
        hasCustomAvatar: false,
        translatedRole: 'Editor',
        userID: '11',
    },
    {
        /* example group contact */
        id: '14',
        collabID: '14',
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
                const collaborators: Array<collaboratorType> = contacts.slice().map(contact => {
                    // convert the existing contact entries to compatible collaborator entries in this example
                    const collaborator: collaboratorType = {
                        collabID: 1234,
                        id: contact.id,
                        name: contact.name || '',
                        type: contact.type !== 'group' ? constants.COLLAB_USER_TYPE : constants.COLLAB_GROUP_TYPE,
                        isExternalCollab: contact.isExternalUser || false,
                        userID: parseInt(contact.id, 10),
                        expiration: { executeAt: contact.isExternalUser ? 'November 27, 2022' : '' },
                        hasCustomAvatar: false,
                        imageURL: null,
                    };

                    return collaborator;
                });

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
                                showUpgradeOptions
                                submitting={state.submitting}
                                suggestedCollaborators={{
                                    '2': {
                                        id: '2',
                                        userScore: 0.1,
                                        name: 'David',
                                        email: 'dt@example.com',
                                        type: 'user',
                                    },
                                    '5': {
                                        id: '5',
                                        userScore: 0.2,
                                        name: 'Will',
                                        email: 'wy@example.com',
                                        type: 'user',
                                    },
                                    '1': {
                                        id: '1',
                                        userScore: 0.5,
                                        name: 'Jeff',
                                        email: 'jt@example.com',
                                        type: 'user',
                                    },
                                    '3': { id: '3', userScore: 2, name: 'Yang', email: 'yz@example.com', type: 'user' },
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
                                showUpgradeOptions
                                submitting={state.submitting}
                                suggestedCollaborators={{
                                    '2': {
                                        id: '2',
                                        userScore: 0.1,
                                        name: 'David',
                                        email: 'dt@example.com',
                                        type: 'user',
                                    },
                                    '5': {
                                        id: '5',
                                        userScore: 0.2,
                                        name: 'Will',
                                        email: 'wy@example.com',
                                        type: 'user',
                                    },
                                    '1': {
                                        id: '1',
                                        userScore: 0.5,
                                        name: 'Jeff',
                                        email: 'jt@example.com',
                                        type: 'user',
                                    },
                                    '3': { id: '3', userScore: 2, name: 'Yang', email: 'yz@example.com', type: 'user' },
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
                                showUpgradeOptions
                                submitting={state.submitting}
                                suggestedCollaborators={{
                                    '2': {
                                        id: '2',
                                        userScore: 0.1,
                                        name: 'David',
                                        email: 'dt@example.com',
                                        type: 'user',
                                    },
                                    '5': {
                                        id: '5',
                                        userScore: 0.2,
                                        name: 'Will',
                                        email: 'wy@example.com',
                                        type: 'user',
                                    },
                                    '1': {
                                        id: '1',
                                        userScore: 0.5,
                                        name: 'Jeff',
                                        email: 'jt@example.com',
                                        type: 'user',
                                    },
                                    '3': { id: '3', userScore: 2, name: 'Yang', email: 'yz@example.com', type: 'user' },
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

export const withFormOnly = () => {
    const componentStore = createComponentStore();
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
                        displayInModal={false}
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
                                console.log('removed link');
                            });
                        }}
                        /* eslint-disable-next-line no-alert */
                        onSettingsClick={() => alert('hi!')}
                        recommendedSharingTooltipCalloutName=""
                        sendInvites={() =>
                            fakeRequest().then(() => {
                                console.log('sent invites');
                            })
                        }
                        sendInvitesError=""
                        sendSharedLink={() =>
                            fakeRequest().then(() => {
                                console.log('sent shared link');
                            })
                        }
                        sendSharedLinkError=""
                        sharedLink={state.sharedLink}
                        showCalloutForUser
                        showFormOnly
                        showUpgradeOptions
                        submitting={state.submitting}
                        suggestedCollaborators={{
                            '2': {
                                id: '2',
                                userScore: 0.1,
                                name: 'David',
                                email: 'dt@example.com',
                                type: 'user',
                            },
                            '5': {
                                id: '5',
                                userScore: 0.2,
                                name: 'Will',
                                email: 'wy@example.com',
                                type: 'user',
                            },
                            '1': {
                                id: '1',
                                userScore: 0.5,
                                name: 'Jeff',
                                email: 'jt@example.com',
                                type: 'user',
                            },
                            '3': { id: '3', userScore: 2, name: 'Yang', email: 'yz@example.com', type: 'user' },
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
