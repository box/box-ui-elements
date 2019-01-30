### Examples

```
const collaborators = [
    {
        avatarUrl: '',
        id: '1',
        name: 'A User',
        interactedAt: Date.now(),
        isActive: true
    },
    {
        avatarUrl: '',
        id: '2',
        name: 'B User',
        interactedAt: 1501300384000,
        interactionType: 'user.comment_create'
    },
    {
        avatarUrl: '',
        id: '3',
        name: 'C User',
        interactedAt: 1502216436000,
        interactionType: 'user.item_upload'
    },
    {
        avatarUrl: '',
        id: '4',
        name: 'D User',
        interactedAt: 1501527327000,
        interactionType: 'user.item_preview'
    },
    {
        avatarUrl: '',
        id: '5',
        name: 'E User',
        interactedAt: 1502217560000,
        interactionType: 'user.item_preview'
    }
];

const getLinkCallback = () => {};
const inviteCallback = () => {};
const avatarAttr = { 'data-resin-target': 'avatar' };
const containerAttr = { 'data-resin-feature': 'presence' };

<div style={ {"height": "300px"} }>
    <Presence
        collaborators={ collaborators }
        maxDisplayedAvatars={ 3 }
        getLinkCallback={ getLinkCallback }
        inviteCallback={ inviteCallback }
        avatarAttributes={ avatarAttr }
        containerAttributes={ containerAttr }
      />
</div>

```
