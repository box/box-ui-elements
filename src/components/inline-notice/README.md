### Description

Static div displaying a message to the user.

### Examples

**Without `title` pop**

```
<div style={ { width: '50%' } }>
    <InlineNotice type="warning">
        This is a <b>warning</b> notification.  You might want to pay attention to this.
    </InlineNotice>

    <InlineNotice type="error">
        This is an <b>error</b> notification.  You really want to pay attention to this.
    </InlineNotice>

    <InlineNotice type="success">
        This is a <b>success</b> notification.  You ought to feel really good about this.
    </InlineNotice>

    <InlineNotice type="info">
        This is an <b>info</b> notification.  You'll just want to notice this.
    </InlineNotice>
</div>
```

**With `title` prop**

```
<div style={ { width: '50%' } }>
       <InlineNotice type="warning" title="Warning Title">
        This is a warning notification.  You might want to pay attention to this.
    </InlineNotice>
    
    <InlineNotice type="error" title="Error Title">
        This is an error notification.  You really want to pay attention to this.
    </InlineNotice>

     <InlineNotice type="success" title="Success Title">
        This is a success notification.  You ought to feel really good about this.
    </InlineNotice>

    <InlineNotice type="info" title="Info Title">
        This is an info notification.  You'll just want to notice this.
    </InlineNotice>
</div>
```
