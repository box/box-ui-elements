// @flow
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';

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

    const [isOpen, setIsOpen] = React.useState(false);
    const [accessLevel, setAccessLevel] = React.useState('peopleInYourCompany');
    const [permissionLevel, setPermissionLevel] = React.useState('canView');
    const [selectorOptions, setSelectorOptions] = React.useState([]);
    const [submitting, setSubmitting] = React.useState(false);

    const closeModal = () => {
        setIsOpen(false);
    };

    const fakeRequest = () => {
        setSubmitting(true);
        return new Promise(resolve => {
            setTimeout(() => {
                setSubmitting(false);
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

        setSelectorOptions(filteredContacts);
    };

    return (
        <div>
            {isOpen && (
                <SharedLinkModal
                    accessLevel={accessLevel}
                    accessMenuButtonProps={{ 'data-resin-target': 'changepermissions' }}
                    allowedAccessLevels={{
                        peopleWithTheLink: true,
                        peopleInYourCompany: true,
                        peopleInThisItem: true,
                    }}
                    canRemoveLink
                    changeAccessLevel={newLevel => fakeRequest().then(() => setAccessLevel(newLevel))}
                    changePermissionLevel={newLevel => fakeRequest().then(() => setPermissionLevel(newLevel))}
                    contacts={selectorOptions}
                    copyButtonProps={{ 'data-resin-target': 'copy' }}
                    defaultEmailMessage="I want to share this file with you.\n\n-me"
                    emailMessageProps={{ 'data-resin-target': 'message' }}
                    expiration={1509173940}
                    getContacts={getContacts}
                    isOpen={isOpen}
                    itemName="somefile.gif"
                    itemType="file"
                    isEditAllowed={permissionLevel === 'canEdit'}
                    isPreviewAllowed={permissionLevel === 'canView'}
                    onRequestClose={closeModal}
                    onSettingsClick={() => null}
                    permissionLevel={permissionLevel}
                    removeLink={() => fakeRequest().then(closeModal)}
                    removeLinkButtonProps={{ 'data-resin-target': 'remove' }}
                    sendEmail={() =>
                        fakeRequest().then(() => {
                            closeModal();
                        })
                    }
                    sharedLink="http://box.com/s/abcdefg"
                    submitting={submitting}
                />
            )}
            <Button onClick={() => setIsOpen(true)}>Shared Link Modal</Button>
        </div>
    );
};

export default {
    title: 'Features/SharedLinkModal',
    component: SharedLinkModal,
    parameters: {
        notes,
    },
};
