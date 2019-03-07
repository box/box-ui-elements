### Examples

**Bordered experience**

```js
const onOpen = arg => {
  console.log('opened', arg);
};
const onClose = arg => {
  console.log('closed', arg);
};
<Collapsible
  isOpen
  onOpen={onOpen}
  onClose={onClose}
  isBordered
  title="Collapsible card title"
>
  <div>This is content of a collapsible component</div>
</Collapsible>;
```

**Non-bordered experience**

```js
<Collapsible isOpen title="Collapsible card title">
  <div>This is content of a collapsible component</div>
</Collapsible>
```

**Collapsible with Button in Header on open**

```js
<Collapsible
  headerActionItems={
    <Button className="collapsible-card-action-items">Click Here</Button>
  }
  isBordered
  isOpen
  title="Collapsible card title"
>
  <div>This is content of a collapsible component</div>
</Collapsible>
```
