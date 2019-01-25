### Description

Simple rounded div with a close action and a configurable timer. The notification itself has no state and is controlled by its parent component.

### Examples

**Default**

```
<Notification>
    This is a default notification.
</Notification>
```

**Info**

```
<Notification type="info">
    <span>This is an info notification with a button.</span>
    <Button>Click me</Button>
</Notification>
```

**Warn**

```
<Notification type="warn">
    <span>This is a warning notification with two buttons.</span>
    <Button>Click me</Button>
    <Button>Click me again</Button>
</Notification>
```

**Error**

```
<Notification type="error">
    <span>This is an error notification.</span>
</Notification>
```
