Example with readonly properties:

```js
const getFileSize = require('utils/getFileSize').default;

<ItemProperties
  createdAt="2012-12-12T11:04:26-08:00"
  description="Hey\ntesting\r\nthis\rlink\n\rhttp://google.com"
  enterpriseOwner="Test Enterprise Owner"
  modifiedAt={1459832991883}
  owner="Test Owner"
  size={getFileSize(629644)}
  trashedAt="2013-02-07T10:49:34-08:00"
  uploader="Test Uploader"
  url="https://box.com"
/>;
```

Editable description:

```js
initialState = { description: '' };

<div style={{ maxWidth: 220 }}>
  <button
    className="mbl"
    onClick={() => {
      setState({ description: 'reset' });
    }}
  >
    Reset description programmatically
  </button>
  <ItemProperties
    createdAt="2012-12-12T11:04:26-08:00"
    description={state.description}
    descriptionTextareaProps={{
      'data-resin-target': 'description',
    }}
    onDescriptionChange={value => {
      setState({ description: value });
    }}
    owner="Test Owner"
  />
</div>;
```

Show retentionPolicy:

```js
<ItemProperties
  retentionPolicyProps={{
    retentionPolicyDescription: 'Retention',
    policyType: 'finite',
    openModal: () => {
      alert('Retention Modal');
    },
    dispositionTime: 1489899991883,
  }}
/>
```

Editable url:

```js
initialState = { url: 'https://box.com' };

<div style={{ maxWidth: 220 }}>
  <button
    className="mbl"
    onClick={() => {
      setState({ url: 'app.box.com' });
    }}
  >
    Reset url programmatically
  </button>
  <ItemProperties
    createdAt="2012-12-12T11:04:26-08:00"
    description="This is the description."
    onValidURLChange={value => {
      setState({ url: value });
    }}
    owner="Test Owner"
    url={state.url}
  />
</div>;
```
