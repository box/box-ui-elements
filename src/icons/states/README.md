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
        name: 'LocationErrorState',
        component: () => {
            const LocationErrorState = require('./LocationErrorState').default;
            return (
                <div>
                    <LocationErrorState/>
                    <LocationErrorState color="#222" />
                </div>
            )
        },
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
        component: () => {
            const NoNotificationState = require('./NoNotificationState').default;
            return (
                <div>
                    <NoNotificationState/>
                    <NoNotificationState color="#222" />
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
        component: () => {
            const NotificationErrorState = require('./NotificationErrorState').default;
            return (
                <div>
                    <NotificationErrorState/>
                    <NotificationErrorState color="#222" />
                </div>
            )
        },
    },
    {
        name: 'RecentsEmptyState',
        component: require('./RecentsEmptyState').default,
    },
    {
        name: 'SandboxesEmptyState',
        component: require('./SandboxesEmptyState').default,
    },
    {
        name: 'SandboxesInterstitialState',
        component: require('./SandboxesInterstitialState').default,
    },
    {
        name: 'SearchEmptyState',
        component: require('./SearchEmptyState').default,
    },
    {
        name: 'SecurityBlockedState',
        component: require('./SecurityBlockedState').default,
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
        name: 'TaskEmptyState',
        component: require('./TaskEmptyState').default,
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
    {
        name: 'UsersEmptyState',
        component: require('./UsersEmptyState').default,
    },
];

<IconsExample icons={icons} />;
```
