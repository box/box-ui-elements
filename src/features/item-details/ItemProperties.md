Example with readonly properties:

```js
const getFileSize = require('utils/getFileSize').default;

<ItemProperties
    createdAt="2012-12-12T11:04:26-08:00"
    description="Hey\ntesting\r\nthis\rlink\n\rhttp://google.com"
    enterpriseOwner="David Lee"
    modifiedAt={1459832991883}
    owner="Jackie Chen"
    size={getFileSize(629644)}
    trashedAt="2013-02-07T10:49:34-08:00"
    uploader="Wenbo Yu"
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
        owner="Jackie Chen"
    />
</div>;
```

Show retentionPolicy:

```js
<ItemProperties
    retentionPolicyProps={{
        retentionPolicyDescription: 'Retention',
        policyType: 'finite',
        openModal: () => {},
        dispositionTime: 1489899991883,
    }}
/>
```

Add classification:

```js
<ItemProperties
    classificationProps={{
        openModal: () => {
            alert('Classification Modal');
        },
    }}
/>
```

Edit classification:

```js
<ItemProperties
    classificationProps={{
        openModal: () => {
            alert('Classification Modal');
        },
        tooltip: 'This document contains sensitive information',
        value: 'Confidential',
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
        owner="Jackie Chen"
        url={state.url}
    />
</div>;
```
