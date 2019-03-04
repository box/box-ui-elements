Example without onClick, has default text styling:

```js
<VersionHistoryLink versionCount={2} />
```

Example with onClick, has link styling

```js
<VersionHistoryLink
  onClick={function() {
    alert('hello, world!');
  }}
  versionCount={2}
/>
```
