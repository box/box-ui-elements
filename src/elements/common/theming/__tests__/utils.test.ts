import { convertTokensToCustomProperties } from '../utils';

describe('elements/common/theming/utils', () => {
    describe('convertTokensToCustomProperties()', () => {
        test('returns correct mapping of tokens to custom properties', () => {
            const tokens = {
                Label: {
                    Bold: {
                        fontSize: '0.625rem',
                        fontWeight: '700',
                        letterSpacing: '0.0375rem',
                        lineHeight: '1rem',
                        paragraphSpacing: '0',
                        textCase: 'none',
                        textDecoration: 'none',
                    },
                    Default: {
                        fontSize: '0.625rem',
                        fontWeight: '400',
                        letterSpacing: '0.0375rem',
                        lineHeight: '1rem',
                        paragraphSpacing: '0',
                        textCase: 'none',
                        textDecoration: 'none',
                    },
                },
            };
            const output = {
                '--label-bold-font-size': '0.625rem',
                '--label-bold-font-weight': '700',
                '--label-bold-letter-spacing': '0.0375rem',
                '--label-bold-line-height': '1rem',
                '--label-bold-paragraph-spacing': '0',
                '--label-bold-text-case': 'none',
                '--label-bold-text-decoration': 'none',
                '--label-default-font-size': '0.625rem',
                '--label-default-font-weight': '400',
                '--label-default-letter-spacing': '0.0375rem',
                '--label-default-line-height': '1rem',
                '--label-default-paragraph-spacing': '0',
                '--label-default-text-case': 'none',
                '--label-default-text-decoration': 'none',
            };
            const result = convertTokensToCustomProperties(tokens);
            expect(result).toEqual(output);
        });
    });
});
