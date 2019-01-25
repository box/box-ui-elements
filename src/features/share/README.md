### Description

Share Menu for an item, with some permission handling.

### Examples

```js
<ShareMenu
    canInvite
    canShare
    isDownloadAllowed
    isPreviewAllowed
    onGetSharedLinkSelect={ () => alert('shared link!') }
    onInviteCollabSelect={ () => alert('invite collabs!') }
/>
```
