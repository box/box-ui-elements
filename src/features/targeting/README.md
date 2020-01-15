### Description
Model to providing Targeting Feature

The TargetingContextProvider consumes MessageAPI and provides TargetingAPI for each message.

### Examples
Targeting Api is provided for each message. It can be consumed by the below pseudo code:
```
function SharedLinkPreviewModal() {
  const { getTargetingApi } = useContext(TargetingContext);

  const { shouldShow, onClose, onSeen } = getTargetingApi('adhoc_shared_link_preview');

  if (shouldShow()) {
    onSeen();
    return <Modal><button onClick={onClose}></button><Model/>
  }
}
```
### Note
* onSeen can only be called once when shouldShow() return true, or it will be ignored.
* onClose can only be called once when shouldShow() return true and onSeen is already called, or it
will be ignored.
