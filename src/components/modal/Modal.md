### Description

A pop up with a close button. The modal component has no state and is controlled by its parent component. Modals are
rendered in a Portal, which would take them out of the regular DOM hierarchy. By default, clicks on the backdrop will
close the modal, but this can be overridden.

### Examples

**Basic**

```
const SimpleModal = ({ isOpen, onRequestClose }) => (
    <Modal
        title="Box: Sharing is simple"
        onRequestClose={ onRequestClose }
        isOpen={ isOpen }
        focusElementSelector="input"
    >
        <p>
            Elements can be auto-focused by implementing transition logic in componentDidUpdate. Focus is trapped inside the modal while it is open, so pressing tab will cycle through the elements inside.
        </p>
        <p><input type="text" /></p>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum congue, lacus ut scelerisque porttitor, libero diam luctus ante, non porta lectus dolor eu lectus. Suspendisse sagittis ut orci eget placerat.
        </p>
        <ModalActions>
            <Button onClick={ onRequestClose }>Cancel</Button>
            <PrimaryButton onClick={ onRequestClose }>Okay</PrimaryButton>
        </ModalActions>
    </Modal>
);
openModal = () =>
    setState({
        isModalOpen: true,
    });
closeModal = () => setState({ isModalOpen: false });

<div>
    <SimpleModal
        onRequestClose={ closeModal }
        isOpen={ state.isModalOpen }
    />
    <PrimaryButton onClick={ openModal }>
        Launch standard modal
    </PrimaryButton>
</div>
```

**Include a custom backdrop click handler, which overrides the default behavior**

```
const SimpleModal = ({ isOpen, onRequestClose }) => (
    <Modal
        title="Box: Sharing is simple"
        onRequestClose={ onRequestClose }
        isOpen={ isOpen }
        focusElementSelector="input"
        onBackdropClick={ confirmBackdropClose }
    >
        <p>
            Elements can be auto-focused by implementing transition logic in componentDidUpdate. Focus is trapped inside the modal while it is open, so pressing tab will cycle through the elements inside.
        </p>
        <p><input type="text" /></p>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum congue, lacus ut scelerisque porttitor, libero diam luctus ante, non porta lectus dolor eu lectus. Suspendisse sagittis ut orci eget placerat.
        </p>
        <ModalActions>
            <Button onClick={ onRequestClose }>Cancel</Button>
            <PrimaryButton onClick={ onRequestClose }>Okay</PrimaryButton>
        </ModalActions>
    </Modal>
);
openModal = () =>
    setState({
        isModalOpen: true,
    });
closeModal = () => setState({ isModalOpen: false });

confirmBackdropClose = () => {
    // We can call the defined `closeModal` message after any custom processing,
    // or do a no-op if we wish to disable backdrop close functionality
    if (confirm('There are unsaved changes. Are you sure you want to close?')) {
        closeModal();
    }
};

<div>
    <SimpleModal
        onRequestClose={ closeModal }
        isOpen={ state.isModalOpen }
    />
    <PrimaryButton onClick={ openModal }>
        Launch standard modal
    </PrimaryButton>
</div>
```
