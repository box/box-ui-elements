#### Without access stats modal

```js
<div style={{ maxWidth: 220 }}>
  <AccessStats
    commentCount={10000}
    downloadCount={10000}
    editCount={10000}
    previewCount={10000}
  />
</div>
```

#### With access stats modal

```js
<div style={{ maxWidth: 220 }}>
  <AccessStats
    commentCount={10000}
    downloadCount={10000}
    editCount={10000}
    previewCount={10000}
    openAccessStatsModal={() => {
      alert('Access Stats Modal');
    }}
  />
</div>
```

#### With count overflow

```js
<div style={{ maxWidth: 220 }}>
  <AccessStats
    commentCount={10000}
    downloadCount={10000}
    editCount={10000}
    hasCountOverflowed
    previewCount={10000}
    openAccessStatsModal={() => {
      alert('Access Stats Modal');
    }}
  />
</div>
```

#### With error

```js
<div style={{ maxWidth: 220 }}>
  <AccessStats
    errorMessage="Sorry, access stats could not be retrieved for this file. Contact support or try again in a few minutes."
    downloadCount={10000}
    editCount={10000}
    previewCount={10000}
  />
</div>
```

#### No events

```js
<div style={{ maxWidth: 220 }}>
  <AccessStats />
</div>
```
