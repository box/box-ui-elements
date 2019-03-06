### Description

`Portal`ed div that acts as a container to hold the notifications. This component has no logic of its own—it should be used to implement your own application-specific logic for creating new notifications.

For example, an application can use redux to implement notifications:

- Notifications are stored in the redux store
- To add a new notification, dispatch an action
- The reducer would create a new notification and add that to its store
- To remove a notification, dispatch an action

### Examples

```
const NotificationsWrapperExample = require('examples').NotificationsWrapperExample;

<NotificationsWrapperExample />
```
