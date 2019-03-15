**State icons**

```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;

const icons = [
    {
        name: 'AccessStatsEmptyState',
        component: require('./AccessStatsEmptyState').default,
    },
    {
        name: 'ActivityFeedEmptyState',
        component: require('./ActivityFeedEmptyState').default,
    },
    {
        name: 'CollaboratorsEmptyState',
        component: require('./CollaboratorsEmptyState').default,
    },
    {
        name: 'CollectionSidebarEmptyState',
        component: require('./CollectionSidebarEmptyState').default,
    },
    {
        name: 'CongratsPartyPeopleState',
        component: require('./CongratsPartyPeopleState').default,
    },
    {
        name: 'EnvelopeTrophyState',
        component: require('./EnvelopeTrophyState').default,
    },
    {
        name: 'ErrorEmptyState',
        component: require('./ErrorEmptyState').default,
    },
    {
        name: 'FavoritesEmptyState',
        component: require('./FavoritesEmptyState').default,
    },
    {
        name: 'FeedEmptyState',
        component: require('./FeedEmptyState').default,
    },
    {
        name: 'FolderEmptyState',
        component: require('./FolderEmptyState').default,
    },
    {
        name: 'MetadataEmptyState',
        component: require('./MetadataEmptyState').default,
    },
    {
        name: 'MultiSelectState',
        component: require('./MultiSelectState').default,
    },
    {
        name: 'NoNotificationState',
        content: () => {
            const NoNotificationState = require('./NoNotificationState').default;
            return (
                <div>
                    <NoNotificationState/>
                    <NoNotificationState color="black"/>
                </div>
            )
        },
    },
    {
        name: 'NotFoundState',
        component: require('./NotFoundState').default,
    },
    {
        name: 'NotificationErrorState',
        content: () => {
            const NotificationErrorState = require('./NotificationErrorState').default;
            return (
                <div>
                    <NotificationErrorState/>
                    <NotificationErrorState color="black"/>
                </div>
            )
        },
    },
    {
        name: 'RecentsEmptyState',
        component: require('./RecentsEmptyState').default,
    },
    {
        name: 'SearchEmptyState',
        component: require('./SearchEmptyState').default,
    },
    {
        name: 'SelectedItemsEmptyState',
        component: require('./SelectedItemsEmptyState').default,
    },
    {
        name: 'SetDefaultAppState',
        component: require('./SetDefaultAppState').default,
    },
    {
        name: 'SharedLinkErrorState',
        component: require('./SharedLinkErrorState').default,
    },
    {
        name: 'SyncEmptyState',
        component: require('./SyncEmptyState').default,
    },
    {
        name: 'TrashEmptyState',
        component: require('./TrashEmptyState').default,
    },
    {
        name: 'UpdatesEmptyState',
        component: require('./UpdatesEmptyState').default,
    },
    {
        name: 'UploadEmptyState',
        component: require('./UploadEmptyState').default,
    },
    {
        name: 'UploadFilePaywallState',
        component: require('./UploadFilePaywallState').default,
    },
    {
        name: 'UploadStartState',
        component: require('./UploadStartState').default,
    },
    {
        name: 'UploadSuccessState',
        component: require('./UploadSuccessState').default,
    },
];

<IconsExample icons={icons} />;
```
