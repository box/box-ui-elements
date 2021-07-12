import * as React from 'react';
import Color from 'color';
import * as variables from './variables';
import mdNotes from './colors.md';

type TSwatch = { scssVariableName: string; colorHex: string; colorKey: string; contrastRatio: number };

const bdlColors: { [k: string]: Array<TSwatch> } = {};

const WCAG_AA = 4.5; // minimum contrast ratio for text

const isPaletteColor = (hex: string, key: string) => {
    return key.startsWith('bdl') && !key.includes('Neutral') && key !== 'bdlSecondaryBlue' && hex.startsWith('#');
};

Object.keys(variables).forEach(colorKey => {
    const colorHex = (variables as { [k: string]: string | Array<string> })[colorKey];
    if (Array.isArray(colorHex)) return;
    if (isPaletteColor(colorHex, colorKey)) {
        const paletteGroup = (colorKey.match(/[A-Z][a-z]+/g) as Array<string>).join(' ');

        if (!bdlColors[paletteGroup]) {
            bdlColors[paletteGroup] = [];
        }

        const color = Color(colorHex);
        const scssVariableName = (colorKey.match(/(bdl)|([A-Z][a-z]+)|(\d+)/g) as Array<string>).join('-');
        const contrastRatio = color.contrast(Color('#fff'));

        bdlColors[paletteGroup].push({ scssVariableName, colorHex, colorKey, contrastRatio });
    }
});

const wrapper: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
};

const palette: React.CSSProperties = {};

const swatchContainer: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
};

const swatch: React.CSSProperties = {
    borderRadius: '4px',
    height: '40px',
    width: '200px',
    display: 'inline-block',
};

const label: React.CSSProperties = {
    margin: '0 8px 0 16px',
};

const LabelCell = (props: { children: React.ReactNode }) => <td style={{ minWidth: 240 }}>{props.children}</td>;

const Swatch = ({ color }: { color: TSwatch }) => (
    <div style={swatchContainer}>
        <span style={{ ...swatch, backgroundColor: color.colorHex }} />
        <table style={label}>
            <tr>
                <LabelCell>
                    <strong>SCSS:</strong> <code>${color.scssVariableName.toLowerCase()}</code>
                </LabelCell>
                <LabelCell>
                    <strong title="WCAG contrast ratio against white background">WCAG:</strong>{' '}
                    <code>{color.contrastRatio.toFixed(2)}</code>{' '}
                    {color.contrastRatio > WCAG_AA ? '(AA ✔︎)' : <s>(AA)</s>}
                </LabelCell>
            </tr>
            <tr>
                <LabelCell>
                    <strong>JS:</strong> <code>{color.colorKey}</code>
                </LabelCell>
                <LabelCell>
                    <strong>Hex:</strong> <code>{color.colorHex}</code>
                </LabelCell>
            </tr>
        </table>
    </div>
);

const allColors = () => (
    <div style={wrapper}>
        <div>
            <h4>Base</h4>
            <div style={palette}>
                <Swatch
                    key="black"
                    color={{ scssVariableName: 'black', colorHex: '#000000', colorKey: 'black', contrastRatio: 100 }}
                />
                <Swatch
                    key="white"
                    color={{ scssVariableName: 'white', colorHex: '#ffffff', colorKey: 'white', contrastRatio: 0 }}
                />
            </div>
        </div>
        {Object.entries(bdlColors)
            .sort((A, B) => {
                // Sort the palette by grayness (hue/saturation = 0) and then by color
                const a = Color(A[1][0].colorHex);
                const b = Color(B[1][0].colorHex);
                if (a.hsl().object().h === 0) return -1;
                if (b.hsl().object().h === 0) return 1;
                return a.rgbNumber() - b.rgbNumber();
            })
            .map(([name, colors]) => (
                <div key={name}>
                    <h4>{name}</h4>
                    <div style={palette}>
                        {colors.map(color => (
                            <Swatch key={color.colorKey} color={color} />
                        ))}
                    </div>
                </div>
            ))}
    </div>
);

export { allColors };

export default {
    title: 'Theming|Colors',
    parameters: {
        notes: mdNotes,
    },
};
