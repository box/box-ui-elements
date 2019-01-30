### Example

If you're using hotkeys in your app, you should use this component instead of the standard `Modal`.

This version wraps `Modal` with a `HotkeyLayer`, which stops shortcuts registered underneath from being triggered while the modal is open.

```
const onRequestClose = () => setState({ isOpen: false });

// @NOTE: the demo hotkeys are actually being registered in SelectableTableExamples

<div>
    <PrimaryButton onClick={ () => setState({ isOpen: true }) }>
        Open modal
    </PrimaryButton>
    <HotkeyFriendlyModal
        isOpen={ state.isOpen }
        onRequestClose={ onRequestClose }
        title='A Modal'
    >
        <p>
            hi! Try pressing "?" while in this modal. Notice that the hotkey help modal does not open (and none of the keyboard shortcuts work either). This is because the HotkeyFriendlyModal wraps Modal with a HotkeyLayer.
        </p>
        <p>
            If you close this modal and press "?", then the help modal will open.
        </p>
        <ModalActions>
            <Button onClick={ onRequestClose }>Cancel</Button>
            <PrimaryButton onClick={ onRequestClose }>Okay</PrimaryButton>
        </ModalActions>
    </HotkeyFriendlyModal>
</div>
```
