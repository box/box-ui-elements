The `Ghost` component can be used to create loading states and placeholder elements. The default shape is a 100% width rectangle.

A circle:

```
<Ghost borderRadius="50%" width={32} height={32} />
```

A rectangle:

```
<Ghost width={100} height={32} />
```

A pill:

```
<Ghost borderRadius={12} width={100} height={24} />
```

A more complicated layout:

```
<Media style={{maxWidth: 400}}>
    <Media.Figure>
        <Ghost borderRadius={"50%"} height={32} width={32} />
    </Media.Figure>
    <Media.Body>
        <p>
            <Ghost />
            <Ghost />
            <Ghost width={"50%"} />
        </p>
        <p>
            <Ghost width={100} height={32} /> <Ghost width={100} height={32} />
        </p>
    </Media.Body>
</Media>
```
