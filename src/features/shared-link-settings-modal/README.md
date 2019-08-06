### Description
Modal to edit Shared Link Settings for an item.

### Examples
```js
const Button = require('box-ui-elements/es/components/button').default;

initialState = {
    isOpen: false,
    submitting: false,
};

const fakeRequest = val => {
    setState({ submitting: true });
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`Request succeeded! Sent: ${JSON.stringify(val)}`);
            setState({ submitting: false });
            resolve();
        }, 500)
    });
};

<div>
    { state.isOpen &&
        <SharedLinkSettingsModal
            accessLevel="peopleWithTheLink"
            canChangeVanityName
            item={{
                bannerPolicy: {
                    body: 'test',
                },
                classification: 'internal',
                grantedPermissions: {
                    itemShare: true
                },
                hideCollaborators: false,
                id: 12345,
                name: 'My Example Folder',
                type: 'folder',
                typedID: 'd_12345'
            }}
            isOpen
            onRequestClose={ () => setState({ isOpen: false })}
            onSubmit={ fakeRequest }
            serverURL="https://box.com/v/"
            submitting={ state.submitting }
            vanityName='vanity'
            canChangePassword
            isPasswordAvailable
            isPasswordEnabled={ false }
            canChangeExpiration
            isDownloadAvailable
            canChangeDownload
            isDownloadEnabled={ false }
            directLink="https://box.com/download/path"
            isDirectLinkAvailable
            isDirectLinkUnavailableDueToDownloadSettings={ false }
            isDirectLinkUnavailableDueToAccessPolicy
            vanityNameInputProps={ { 'data-resin-target': 'test' } }
            passwordCheckboxProps={ { 'data-resin-target': 'test' } }
            passwordInputProps={ { 'data-resin-target': 'test' } }
            expirationCheckboxProps={ { 'data-resin-target': 'test' } }
            expirationInputProps={ { 'data-resin-target': 'test' } }
            downloadCheckboxProps={ { 'data-resin-target': 'test' } }
            directLinkInputProps={ { 'data-resin-target': 'test' } }
            saveButtonProps={ { 'data-resin-target': 'test' } }
            cancelButtonProps={ { 'data-resin-target': 'test' } }
            modalProps={ { 'data-resin-feature': 'test' } }
            warnOnPublic={state.isPublic}
        />}
    <Button
        onClick={ () => setState({ isOpen: true })}
    >
        Shared Link Settings Modal
    </Button>
</div>
```