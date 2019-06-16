```jsx
const colors = require('box-ui-elements/es/styles/variables');
const bdlColors = {};

Object.keys(colors).forEach(colorKey => {
  if (
    colorKey.startsWith('bdl') &&
    !colorKey.includes('Neutral') &&
    colorKey !== 'bdlSecondaryBlue' &&
    colors[colorKey].startsWith('#')
  ) {
    const colorNameBreakDown = colorKey
      .match(/(bdl)|([A-Z][a-z]+)|(\d+)/g)
      .join('-');
    const allowColorKey = colorKey.match(/[A-Z][a-z]+/g).join(' ');

    if (!bdlColors[allowColorKey]) {
      bdlColors[allowColorKey] = [];
    }

    bdlColors[allowColorKey].push([colorNameBreakDown, colors[colorKey]]);
  }
});

<div>
  {Object.keys(bdlColors).map(key => {
    return (
      <div>
        <h4>{key}</h4>
        <div className="palette">
          {bdlColors[key].map(color => {
            return (
              <div className="swatch-container">
                <div className="swatch" style={{ backgroundColor: color[1] }} />
                <label>
                  {color[1]} - ${color[0].toLowerCase()}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    );
  })}
  <div>
    <h4>White</h4>
    <div className="palette">
      <div className="swatch-container">
        <div className="swatch" style={{ backgroundColor: '#fff' }} />
        <label>#fff - $white</label>
      </div>
    </div>
  </div>
  <div>
    <h4>Black</h4>
    <div className="palette">
      <div className="swatch-container">
        <div className="swatch" style={{ backgroundColor: '#000' }} />
        <label>#000 - $black</label>
      </div>
    </div>
  </div>
</div>;
```
