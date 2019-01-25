This badge component can be used to update counts with numbers or text representations. Ideally paired with `Badgeable`, it includes animations and props to reveal the count as desired.

### Animated Example

```js
<CountBadge isVisible shouldAnimate value="1"/>
```

### No Animations

```js
<CountBadge isVisible value="3,000"/>
```

### Useful HTML Entities

Remember that React will escape HTML entity names (e.g., &amp;amp; &amp;bull; &amp;times;), so if you want to use symbols, make sure to use the unicode-escaped name for the character.

```js
<CountBadge isVisible value="\u2022"/>
<hr/>
<CountBadge isVisible value="\u00d7"/>
```