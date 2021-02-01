`import CountBadge from 'box-ui-elements/es/components/count-badge';`

The `<CountBadge>` component can be used to update counts with numbers or text representations. Ideally paired with `<Badgeable>`, it includes animations and props to reveal the count as desired.

Remember that React will escape HTML entity names (e.g., &amp;amp; &amp;bull; &amp;times;), so if you want to use symbols, use `String.fromCharCode()` with the UTF-16 code for the character.
