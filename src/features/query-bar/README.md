### Description

### Demo

**Query Bar Loading State**
```js
const MetadataViewQueryBarExamples = require('examples').MetadataViewQueryBarExamples;

<div>
    <MetadataViewQueryBarExamples />
</div>
```

**Query Bar**
```js
const MetadataViewQueryBarExamples = require('examples').MetadataViewQueryBarExamples;
const template = require('./components/fixtures').template;

<div>
    <MetadataViewQueryBarExamples templates={[template]} activeTemplate={template} />
    Note: When Apply is clicked, the results of onFilterChange are logged to console.
</div>
```