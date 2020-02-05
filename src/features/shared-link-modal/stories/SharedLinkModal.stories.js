// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { State, Store } from '@sambego/storybook-state';
import { boolean } from '@storybook/addon-knobs';

import Button from '../../../components/button/Button';

import SharedLinkModal from '../SharedLinkModal';
import notes from './SharedLinkModal.stories.md';

export const basic = () => {
    const contacts = [
        { id: 0, name: 'Jackie', email: 'j@example.com', type: 'user' },
        { id: 1, name: 'Jeff', email: 'jt@example.com', type: 'user' },
        { id: 2, name: 'David', email: 'dt@example.com', type: 'user' },
        { id: 3, name: 'Yang', email: 'yz@example.com', type: 'user' },
        { id: 4, name: 'Yong', email: 'ysu@example.com', type: 'user' },
        { id: 5, name: 'Will', email: 'wy@example.com', type: 'user' },
        { id: 6, name: 'Dave', email: 'd@example.com', type: 'user' },
        { id: 7, name: 'Ke', email: 'k@example.com', type: 'user' },
        { id: 8, name: 'Wenbo', email: 'w@example.com', type: 'user' },
        {
            id: 11,
            name: 'Supersupersupersuperreallyreallyreallylongfirstname incrediblyspectacularlylonglastname',
            email: 'Supersupersupersuperreallyreallyreallyincrediblyspectacularlylongemail@example.com',
            type: 'user',
        },
    ];

    const componentStore = new Store({
        isOpen: false,
        accessLevel: 'peopleInYourCompany',
        permissionLevel: 'canView',
        selectorOptions: [],
    });

    const closeModal = () => {
        componentStore.set({
            isOpen: false,
        });
    };

    const fakeRequest = () => {
        componentStore.set({ submitting: true });
        return new Promise(resolve => {
            setTimeout(() => {
                componentStore.set({ submitting: false });
                resolve();
            }, 500);
        });
    };

    const isSubstring = (value, searchString) => {
        return value && value.toLowerCase().indexOf(searchString.toLowerCase()) !== -1;
    };

    const getContacts = searchString => {
        const filteredContacts = contacts.filter(
            ({ name, email }) => isSubstring(name, searchString) || isSubstring(email, searchString),
        );

        componentStore.set({ selectorOptions: filteredContacts });
    };

    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en">
                    <div>
                        {state.isOpen && (
                            <SharedLinkModal
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
                                changePermissionLevel={newLevel =>
                                    fakeRequest().then(() => componentStore.set({ permissionLevel: newLevel }))
                                }
                                contacts={state.selectorOptions}
                                copyButtonProps={{ 'data-resin-target': 'copy' }}
                                defaultEmailMessage="I want to share this file with you.\n\n-me"
                                emailMessageProps={{ 'data-resin-target': 'message' }}
                                expiration={1509173940}
                                getContacts={getContacts}
                                isOpen={state.isOpen}
                                itemName="somefile.gif"
                                itemType="file"
                                isEditAllowed={state.permissionLevel === 'canEdit'}
                                isPreviewAllowed={state.permissionLevel === 'canView'}
                                onRequestClose={closeModal}
                                onSettingsClick={() => null}
                                permissionLevel={state.permissionLevel}
                                removeLink={() => fakeRequest().then(closeModal)}
                                removeLinkButtonProps={{ 'data-resin-target': 'remove' }}
                                sendEmail={() =>
                                    fakeRequest().then(() => {
                                        closeModal();
                                    })
                                }
                                sharedLink="http://box.com/s/abcdefg"
                                submitting={state.submitting}
                            />
                        )}
                        <Button
                            onClick={() =>
                                componentStore.set({
                                    isOpen: true,
                                })
                            }
                        >
                            Shared Link Modal
                        </Button>
                    </div>
                </IntlProvider>
            )}
        </State>
    );
};

export default {
    title: 'Features|SharedLinkModal',
    component: SharedLinkModal,
    parameters: {
        notes,
    },
};
