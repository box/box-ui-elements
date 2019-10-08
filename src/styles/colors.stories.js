// @flow
import * as React from 'react';
import * as colors from './variables';
import mdNotes from './colors.md';

const bdlColors = {};
Object.keys(colors).forEach(colorKey => {
    if (
        colorKey.startsWith('bdl') &&
        !colorKey.includes('Neutral') &&
        colorKey !== 'bdlSecondaryBlue' &&
        colors[colorKey].startsWith('#')
    ) {
        const colorNameBreakDown = colorKey.match(/(bdl)|([A-Z][a-z]+)|(\d+)/g).join('-');
        const allowColorKey = colorKey.match(/[A-Z][a-z]+/g).join(' ');

        if (!bdlColors[allowColorKey]) {
            bdlColors[allowColorKey] = [];
        }

        bdlColors[allowColorKey].push([colorNameBreakDown, colors[colorKey], colorKey]);
    }
});

const wrapper = {
    margin: '20px',
};

const palette = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: '20px 10px',
};

const swatch = {
    borderRadius: '3px',
    height: '40px',
    marginBottom: '4px',
    width: '200px',
};

const swatchContainer = {
    margin: '10px',
};

const label = {
    margin: '3px 0 5px',
};

const Swatch = ({ color }: { color: Array<string> }) => (
    <div style={swatchContainer}>
        <div style={{ ...swatch, backgroundColor: color[1] }} />
        <label style={label}>
            <strong>CSS:</strong> {color[1]}
            <br />
            <strong>SCSS:</strong> ${color[0].toLowerCase()}
            <br />
            <strong>JS:</strong> {color[2]}
        </label>
    </div>
);

const SwatchSection = ({ swatchColor }: { swatchColor: string }) => (
    <div style={wrapper}>
        <div style={palette}>
            {bdlColors[swatchColor].map(color => (
                <Swatch key={color[1]} color={color} />
            ))}
        </div>
    </div>
);

const allColors = () => (
    <div style={wrapper}>
        <div>
            <h4>White</h4>
            <div style={palette}>
                <div style={swatchContainer}>
                    <div style={{ ...swatch, backgroundColor: '#fff' }} />
                    <label style={label}>
                        <strong>CSS:</strong> #fff
                        <br />
                        <strong>SCSS:</strong> $white
                        <br />
                        <strong>JS:</strong> white
                    </label>
                </div>
            </div>
        </div>
        <div>
            <h4>Black</h4>
            <div style={palette}>
                <div style={swatchContainer}>
                    <div style={{ ...swatch, backgroundColor: '#000' }} />
                    <label style={label}>
                        <strong>CSS:</strong> #000
                        <br />
                        <strong>SCSS:</strong> $black
                        <br />
                        <strong>JS:</strong> black
                    </label>
                </div>
            </div>
        </div>
        {Object.keys(bdlColors).map(key => (
            <div key={key}>
                <h4>{key}</h4>
                <div style={palette}>
                    {bdlColors[key].map(color => (
                        <Swatch key={color[1]} color={color} />
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const boxBlue = () => <SwatchSection swatchColor="Box Blue" />;

const gray = () => <SwatchSection swatchColor="Gray" />;

const darkBlue = () => <SwatchSection swatchColor="Dark Blue" />;

const lightBlue = () => <SwatchSection swatchColor="Light Blue" />;

const yellorange = () => <SwatchSection swatchColor="Yellorange" />;

const yellow = () => <SwatchSection swatchColor="Yellow" />;

const grimace = () => <SwatchSection swatchColor="Grimace" />;

const greenLight = () => <SwatchSection swatchColor="Green Light" />;

const purpleRain = () => <SwatchSection swatchColor="Purple Rain" />;

const watermelonRed = () => <SwatchSection swatchColor="Watermelon Red" />;

export {
    allColors,
    boxBlue,
    gray,
    darkBlue,
    lightBlue,
    yellorange,
    yellow,
    greenLight,
    grimace,
    purpleRain,
    watermelonRed,
};

export default {
    title: 'Theming|Colors',
    parameters: {
        notes: mdNotes,
    },
};
