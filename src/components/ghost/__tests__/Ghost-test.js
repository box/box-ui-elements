import * as React from 'react';
import { render } from 'enzyme';
import Ghost from '../Ghost';

describe('components/Ghost', () => {
    test('renders element with default options', () => {
        const html = render(<Ghost />);
        expect(html).toMatchInlineSnapshot(`
            <span
              class="bdl-Ghost bdl-Ghost--isAnimated"
            />
        `);
    });

    test('isAnimated prop controls modifier class that applies animation effect', () => {
        const html = render(<Ghost isAnimated={false} />);
        expect(html).toMatchInlineSnapshot(`
            <span
              class="bdl-Ghost"
            />
        `);
    });

    test.each`
        label                                | borderRadius | height | width  | style
        ${'no style prop'}                   | ${'2px'}     | ${100} | ${100} | ${undefined}
        ${'a partial style object'}          | ${'2px'}     | ${100} | ${100} | ${{ height: 20 }}
        ${'a style object with all options'} | ${'2px'}     | ${100} | ${100} | ${{ borderRadius: '100%', height: 20, width: 10 }}
        ${'partial options and styles'}      | ${undefined} | ${100} | ${100} | ${{ height: 20, width: 10 }}
    `(
        'merges style prop on top of inline styling options when there is $label',
        ({ borderRadius, height, width, style }) => {
            expect(
                render(<Ghost borderRadius={borderRadius} height={height} width={width} style={style} />),
            ).toMatchSnapshot();
        },
    );
});
