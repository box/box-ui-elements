### Description
Renders a modal to invite collaborators to an item.
### Examples
**Folder Invite Collab**
```js
const Button = require('box-ui-elements/es/components/button').default;

initialState = {
    isOpen: false,
};

const closeModal = () => {
    setState({
        isOpen: false,
    });

    return Promise.resolve();
};

const contacts = [
    { id: 0, name: 'Jackie', email: 'jackie@box.com', type: 'user' },
    { id: 1, name: 'Jeff', email: 'jtan@box.com', type: 'user' },
    { id: 2, name: 'David', email: 'dtong@box.com', type: 'user' },
    { id: 3, name: 'Yang', email: 'yzhao@box.com', type: 'user' },
    { id: 4, name: 'Yong', email: 'ysu@box.com', type: 'user' },
    { id: 5, name: 'Will', email: 'wyau@box.com', type: 'user' },
    { id: 6, name: 'Dave', email: 'djordan@box.com', type: 'user' },
    { id: 7, name: 'Ke', email: 'kehuang@box.com', type: 'user' },
    { id: 8, name: 'Wenbo', email: 'wyu@box.com', type: 'user' },
    { id: 9, name: 'Engineers', type: 'group' },
    { id: 10, name: 'Ballers', type: 'group' },
    { id: 11, name: 'Supersupersupersuperreallyreallyreallylongfirstname incrediblyspectacularlylonglastname', email: 'Supersupersupersuperreallyreallyreallyincrediblyspectacularlylongemail@box.com', type: 'user' },
];

<div>
    <InviteCollaboratorsModal
        collaborationRestrictionWarning="Collaboration invitations can only be sent to people within Box Corporate"
        contacts={ contacts }
        defaultPersonalMessage="I'd like to invite you to collaborate on this item!"
        isOpen={ state.isOpen }
        isEligibleForReferAFriendProgram
        itemName="My Example Folder"
        itemType="folder"
        itemTypedID="12345"
        onRequestClose={ closeModal }
        sendInvites={ closeModal }
        showUpgradeOptions
        inviteePermissions={
            [
                {value: 'Editor', text: 'Editor'},
                {value: 'Owner', text: 'Owner'},
                {value: 'Uploader', text: 'Uploader'},
            ]
        }
    />
    <Button
        onClick={ () =>
            setState({
                isOpen: true,
            }) }
    >
        Folder Invite Collab
    </Button>
</div>

```
**File Invite Collab**
```js
const Button = require('box-ui-elements/es/components/button').default;

initialState = {
    isOpen: false,
};

const closeModal = () => {
    setState({
        isOpen: false,
    });

    return Promise.resolve();
};

const contacts = [
    { id: 0, name: 'Jackie', email: 'jackie@box.com', type: 'user' },
    { id: 1, name: 'Jeff', email: 'jtan@box.com', type: 'user' },
    { id: 2, name: 'David', email: 'dtong@box.com', type: 'user' },
    { id: 3, name: 'Yang', email: 'yzhao@box.com', type: 'user' },
    { id: 4, name: 'Yong', email: 'ysu@box.com', type: 'user' },
    { id: 5, name: 'Will', email: 'wyau@box.com', type: 'user' },
    { id: 6, name: 'Dave', email: 'djordan@box.com', type: 'user' },
    { id: 7, name: 'Ke', email: 'kehuang@box.com', type: 'user' },
    { id: 8, name: 'Wenbo', email: 'wyu@box.com', type: 'user' },
    { id: 9, name: 'Engineers', type: 'group' },
    { id: 10, name: 'Ballers', type: 'group' },
    { id: 11, name: 'Supersupersupersuperreallyreallyreallylongfirstname incrediblyspectacularlylonglastname', email: 'Supersupersupersuperreallyreallyreallyincrediblyspectacularlylongemail@box.com', type: 'user' },
];

<div>
    <InviteCollaboratorsModal
        collaborationRestrictionWarning="Collaboration invitations can only be sent to people within Box Corporate"
        contacts={ contacts }
        isOpen={ state.isOpen }
        itemName="My Example File"
        itemType="file"
        itemTypedID="12345"
        onRequestClose={ closeModal }
        sendInvites={ closeModal }
    />
    <Button
        onClick={ () =>
            setState({
                isOpen: true,
            }) }
    >
        File Invite Collab
    </Button>
</div>
```
