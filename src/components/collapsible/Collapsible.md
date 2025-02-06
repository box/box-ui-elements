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
  <div>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book. It has survived not only five centuries, but also
    the leap into electronic typesetting, remaining essentially unchanged. It
    was popularised in the 1960s with the release of Letraset sheets containing
    Lorem Ipsum passages, and more recently with desktop publishing software
    like Aldus PageMaker including versions of Lorem Ipsum.
  </div>
</Collapsible>;
```

**Non-bordered experience**

```js
<Collapsible isOpen title="Collapsible card title">
  <div>This is content of a collapsible component</div>
  <div>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book. It has survived not only five centuries, but also
    the leap into electronic typesetting, remaining essentially unchanged. It
    was popularised in the 1960s with the release of Letraset sheets containing
    Lorem Ipsum passages, and more recently with desktop publishing software
    like Aldus PageMaker including versions of Lorem Ipsum.
  </div>
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
  <div>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book. It has survived not only five centuries, but also
    the leap into electronic typesetting, remaining essentially unchanged. It
    was popularised in the 1960s with the release of Letraset sheets containing
    Lorem Ipsum passages, and more recently with desktop publishing software
    like Aldus PageMaker including versions of Lorem Ipsum.
  </div>
</Collapsible>
```
