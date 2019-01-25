### Examples

```
const collaborators = [
    {
        avatarUrl: '',
        id: '1',
        name: 'David Rudnick',
        interactedAt: Date.now(),
        isActive: true
    },
    {
        avatarUrl: '',
        id: '2',
        name: 'Raf Rennie',
        interactedAt: 1501300384000,
        interactionType: 'user.comment_create'
    },
    {
        avatarUrl: '',
        id: '3',
        name: 'Eric Hu',
        interactedAt: 1502216436000,
        interactionType: 'user.item_upload'
    },
    {
        avatarUrl: '',
        id: '4',
        name: 'Bosh Bhi',
        interactedAt: 1501527327000,
        interactionType: 'user.item_preview'
    },
    {
        avatarUrl: '',
        id: '5',
        name: 'Hassan Rahim',
        interactedAt: 1502217560000,
        interactionType: 'user.item_preview'
    }
];
const containerAttr = { 'data-resin-feature': 'presence' };

<div style={ {"height": "300px"} }>
    <PresenceLink
        collaborators={ collaborators }
        containerAttributes= { containerAttr }
        flyoutPosition= "bottom-right"
      >
        5 others
      </PresenceLink>
</div>

```
