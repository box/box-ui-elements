### Description

Modal to get/manage a Shared Link for an item. It is configurable to show features only if you pass the required props for those features. For instance, the permission menu (i.e. the one that lets you choose between "Can View" and "Can Edit") will not show up if `permissionLevel` or `changePermissionLevel` props are not present. Likewise, the Email Shared Link section will not show up if you do not pass it the required props.

### Examples

```js
const Button = require('box-ui-elements/es/components/button').default;

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
    name:
      'Supersupersupersuperreallyreallyreallylongfirstname incrediblyspectacularlylonglastname',
    email:
      'Supersupersupersuperreallyreallyreallyincrediblyspectacularlylongemail@example.com',
    type: 'user',
  },
];

initialState = {
  isOpen: false,
  accessLevel: 'peopleInYourCompany',
  permissionLevel: 'canView',
  selectorOptions: [],
};

const closeModal = () => {
  setState({
    isOpen: false,
  });
};

const fakeRequest = () => {
  setState({ submitting: true });
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Request succeeded!');
      setState({ submitting: false });
      resolve();
    }, 500);
  });
};

const isSubstring = (value, searchString) => {
  return (
    value && value.toLowerCase().indexOf(searchString.toLowerCase()) !== -1
  );
};

const getContacts = searchString => {
  const filteredContacts = contacts.filter(
    ({ name, email }) =>
      isSubstring(name, searchString) || isSubstring(email, searchString),
  );

  setState({ selectorOptions: filteredContacts });
};

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
      canRemoveLink
      changeAccessLevel={newLevel =>
        fakeRequest().then(() => setState({ accessLevel: newLevel }))
      }
      changePermissionLevel={newLevel =>
        fakeRequest().then(() => setState({ permissionLevel: newLevel }))
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
      onSettingsClick={() => alert('hi!')}
      permissionLevel={state.permissionLevel}
      removeLink={() => fakeRequest().then(closeModal)}
      removeLinkButtonProps={{ 'data-resin-target': 'remove' }}
      sendEmail={({ emails, emailMessage }) =>
        fakeRequest().then(() => {
          closeModal();
          console.log(
            `Sent invite to ${emails} with message "${emailMessage}"`,
          );
        })
      }
      sharedLink="http://box.com/s/abcdefg"
      submitting={state.submitting}
    />
  )}
  <Button
    onClick={() =>
      setState({
        isOpen: true,
      })
    }
  >
    Shared Link Modal
  </Button>
</div>;
```
