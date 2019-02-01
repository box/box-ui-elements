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
const template1 = require('examples/MetadataViewExamples').template1;

<div>
    <MetadataViewQueryBarExamples templates={[template1]} />
</div>
```

**Default View**
```js

const MetadataViewExamples = require('examples').MetadataViewExamples;
const template = require('examples/MetadataViewExamples').template1;
<div>
    <MetadataViewExamples template={template} currentMessage="" templates={[template]} />
</div>
```

**Column Button Grayed Out Due to One Field in Template**
```js

const MetadataViewExamples = require('examples').MetadataViewExamples;
const template = require('examples/MetadataViewExamples').template2;

<div>
    <MetadataViewExamples template={template} />
</div>
```

**Between 10k and 100K results message**
```js
const MetadataViewExamples = require('examples').MetadataViewExamples;
const template = require('examples/MetadataViewExamples').template1;

<div>
    <MetadataViewExamples currentMessage="needRefining" template={template} />
</div>
```

**Over 100K results message**
```js
const MetadataViewExamples = require('examples').MetadataViewExamples;
const template = require('examples/MetadataViewExamples').template1;

<div>
    <MetadataViewExamples currentMessage="tooManyResults" template={template} />
</div>
```

**No access for query message**
```js
const MetadataViewExamples = require('examples').MetadataViewExamples;
const template = require('examples/MetadataViewExamples').template1;

<div>
    <MetadataViewExamples currentMessage="noAccessForQuery" template={template} />
</div>
```

**No access for template message**
```js
const MetadataViewExamples = require('examples').MetadataViewExamples;
const template = require('examples/MetadataViewExamples').template1;

<div>
    <MetadataViewExamples currentMessage="noAccessForTemplate" template={template} />
</div>
```

**Skeleton Item List**
```js
const SkeletonItemListExample = require('examples').SkeletonItemListExample;

<div>
    <SkeletonItemListExample numberOfRows={10}/>
</div>
```
