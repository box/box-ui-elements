#### Shared Link Flyout

```js
const Button = require('box-ui-elements/es/components/button').default;
const Flyout = require('box-ui-elements/es/components/flyout/Flyout').default;
const Overlay = require('box-ui-elements/es/components/flyout/Overlay').default;

const [state, setState] = React.useState({
  accessLevel: 'peopleInYourCompany',
  submitting: false,
});

const fakeRequest = () => {
  setState(prevState => ({ ...prevState, submitting: true }));
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Request succeeded!');
      setState(prevState => ({ ...prevState, submitting: false }));
      resolve();
    }, 500);
  });
};

<Flyout
  className="shared-link-flyout"
  closeOnClick={false}
  constrainToScrollParent={false}
  constrainToWindow
  portaledClasses={['modal', 'share-access-menu']}
  position="bottom-left"
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
      canRemoveLink
      changeAccessLevel={newLevel =>
        fakeRequest().then(() =>
          setState(prevState => ({ ...prevState, accessLevel: newLevel })),
        )
      }
      copyButtonProps={{ 'data-resin-target': 'copy' }}
      enterpriseName="Box"
      isDownloadAllowed
      isEditAllowed
      isPreviewAllowed
      itemType="folder"
      onSettingsClick={() => alert('opening settings modal')}
      removeLink={fakeRequest}
      removeLinkButtonProps={{ 'data-resin-target': 'remove' }}
      settingsButtonProps={{ 'data-resin-target': 'settings' }}
      sharedLink="http://box.com/s/abcdefg"
      submitting={state.submitting}
    />
  </Overlay>
</Flyout>;
```
