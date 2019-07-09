Implements the "media object" element from Bootstrap

This is a compound component, the inner elements are not meant to be used outside of the Media container

```plaintext
import Media from 'box-ui-elements/es/components/media'

<Media />
<Media.Img />
<Media.Body />
<Media.Menu />
```

```js
<Media style={{ width: 300 }}>
  <Media.Img>
    <Avatar size="large" />
  </Media.Img>

  <Media.Body>
    <Media.Menu>Hi</Media.Menu>
    <div>
      <b>Yo Yo Ma</b> commented on this file
    </div>
    <div>
      Please review the notes
      <br />a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8
      9 0 1 2 3 4 5 6 7 8 9
    </div>
  </Media.Body>
</Media>
```
