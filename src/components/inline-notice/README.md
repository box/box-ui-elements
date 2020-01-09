### Description

Static div displaying a message to the user.

### Examples

**Without `title` pop**

```
<div style={ { width: '50%' } }>
    <InlineNotice type="warning">
        This is a <strong>warning</strong> notice. You might want to pay attention to this.
    </InlineNotice>

    <InlineNotice type="error">
        This is an <strong>error</strong> notice. You really want to pay attention to this.
    </InlineNotice>

    <InlineNotice type="success">
        This is a <strong>success</strong> notice. You ought to feel really good about this.
    </InlineNotice>

    <InlineNotice type="info">
        This is an <strong>info</strong> notice. You should get some context from this.
    </InlineNotice>

    <InlineNotice type="generic">
        This is an <strong>generic</strong> notice. You'll just want to see this.
    </InlineNotice>
</div>
```

**With `title` prop**

```
<div style={ { width: '50%' } }>
    <InlineNotice type="warning" title="Warning Title">
        This is a warning notice. You might want to pay attention to this.
    </InlineNotice>
    
    <InlineNotice type="error" title="Error Title">
        This is an error notice. You really want to pay attention to this.
    </InlineNotice>

     <InlineNotice type="success" title="Success Title">
        This is a success notice. You ought to feel really good about this.
    </InlineNotice>

    <InlineNotice type="info" title="Info Title">
        This is an info notice. You should get some context from this.
    </InlineNotice>

    <InlineNotice type="generic" title="Generic Title">
        This is a generic notice. You'll just want to notice this.
    </InlineNotice>
</div>
```
