import React from 'react';

import Composition from '../Composition';

describe('components/i18n/Composition', () => {
    test('ComposeString', () => {
        const c = new Composition('this is a test');
        expect(c.compose()).toEqual('this is a test');
    });

    test('ComposeNull', () => {
        const c = new Composition(null);
        expect(c.compose()).toEqual('');
    });

    test('ComposeUndefined', () => {
        const c = new Composition();
        expect(c.compose()).toEqual('');
    });

    test('ComposeBoolean', () => {
        const c = new Composition(false);
        expect(c.compose()).toEqual('false');
    });

    test('ComposeElementNoChildren', () => {
        const el = React.createElement('span', { key: 'a' });
        const c = new Composition(el);

        expect(c.compose()).toEqual('<c0></c0>');
    });

    test('ComposeElementOneChild', () => {
        const el = React.createElement('span', { key: 'a' }, 'foo');
        const c = new Composition(el);
        expect(c.compose()).toEqual('<c0>foo</c0>');
    });

    test('ComposeElementTwoChildren', () => {
        const el = React.createElement('span', { key: 'a' }, ['foo', ' bar']);
        const c = new Composition(el);

        expect(c.compose()).toEqual('<c0>foo bar</c0>');
    });

    test('ComposeElementSubchildrenSimple', () => {
        const el = React.createElement('span', { key: 'a' }, [
            'This is a test of the ',
            React.createElement('b', { key: 'b' }, 'emergency broadcast system'),
            '. This is only a test.',
        ]);
        const c = new Composition(el);
        expect(c.compose()).toEqual(
            '<c0>This is a test of the <c1>emergency broadcast system</c1>. This is only a test.</c0>',
        );
    });

    test('ComposeElementMultipleSubchildren', () => {
        const el = React.createElement('span', { key: 'a' }, [
            'This is a test of the ',
            React.createElement('b', { key: 'b' }, 'emergency broadcast system'),
            '. This is ',
            React.createElement('b', { key: 'c' }, 'only'),
            ' a test.',
        ]);
        const c = new Composition(el);
        expect(c.compose()).toEqual(
            '<c0>This is a test of the <c1>emergency broadcast system</c1>. This is <c2>only</c2> a test.</c0>',
        );
    });

    test('ComposeElementSubchildrenComplex', () => {
        const el = React.createElement('span', { key: 'x' }, [
            'This is a test of the ',
            React.createElement('b', { key: 'y' }, [
                'emergency ',
                React.createElement('i', { key: 'z' }, 'broadcast'),
                ' system',
            ]),
            '. This is only a test.',
        ]);

        const c = new Composition(el);
        expect(c.compose()).toEqual(
            '<c0>This is a test of the <c1>emergency <c2>broadcast</c2> system</c1>. This is only a test.</c0>',
        );
    });

    test('DecomposeElementString', () => {
        const c = new Composition('simple string');
        expect(c.decompose('einfache Zeichenfolge')).toEqual('einfache Zeichenfolge');
    });

    test('DecomposeOneChild', () => {
        const el = React.createElement('span', { key: 'a' }, 'simple string');

        const expected = React.createElement('span', { key: 'a' }, 'einfache Zeichenfolge');

        const c = new Composition(el);
        expect(c.decompose('<c0>einfache Zeichenfolge</c0>')).toEqual(expected);
    });

    test('DecomposeSubchildren', () => {
        const el = React.createElement('span', { key: 'a' }, [
            'This is a test of the ',
            React.createElement('b', { key: 'b' }, 'emergency broadcast system'),
            '. This is only a test.',
        ]);

        const expected = React.createElement('span', { key: 'a' }, [
            'Dies ist ein Test des ',
            React.createElement('b', { key: 'b' }, 'Notfall-Broadcast-Systems'),
            '. Dies ist nur ein Test.',
        ]);

        const c = new Composition(el);
        expect(
            c.decompose('<c0>Dies ist ein Test des <c1>Notfall-Broadcast-Systems</c1>. Dies ist nur ein Test.</c0>'),
        ).toEqual(expected);
    });

    test('DecomposeComplex', () => {
        const el = React.createElement('span', { key: 'a' }, [
            'This is a test of the ',
            React.createElement('b', { key: 'b' }, [
                'emergency ',
                React.createElement('i', { key: 'c' }, 'broadcast'),
                ' system',
            ]),
            '. This is only a test.',
        ]);

        const expected = React.createElement('span', { key: 'a' }, [
            'Dies ist ein Test des ',
            React.createElement('b', { key: 'b' }, [
                'Notfall-',
                React.createElement('i', { key: 'c' }, 'Broadcast'),
                '-Systems',
            ]),
            '. Dies ist nur ein Test.',
        ]);

        const c = new Composition(el);
        expect(
            c.decompose(
                '<c0>Dies ist ein Test des <c1>Notfall-<c2>Broadcast</c2>-Systems</c1>. Dies ist nur ein Test.</c0>',
            ),
        ).toEqual(expected);
    });

    test('DecomposeComplexPreservingOtherProperties', () => {
        const el = React.createElement('span', { key: 'a', foo: 'bar' }, [
            'This is a test of the ',
            React.createElement('b', { key: 'b' }, [
                'emergency ',
                React.createElement('i', { key: 'c', asdf: 'fdsa' }, 'broadcast'),
                ' system',
            ]),
            '. This is only a test.',
        ]);

        const expected = React.createElement('span', { key: 'a', foo: 'bar' }, [
            'Dies ist ein Test des ',
            React.createElement('b', { key: 'b' }, [
                'Notfall-',
                React.createElement('i', { key: 'c', asdf: 'fdsa' }, 'Broadcast'),
                '-Systems',
            ]),
            '. Dies ist nur ein Test.',
        ]);

        const c = new Composition(el);
        expect(
            c.decompose(
                '<c0>Dies ist ein Test des <c1>Notfall-<c2>Broadcast</c2>-Systems</c1>. Dies ist nur ein Test.</c0>',
            ),
        ).toEqual(expected);
    });

    test('DecomposeRearrangedComponents', () => {
        const el = React.createElement('span', { key: 'a', foo: 'bar' }, [
            'This is ',
            React.createElement('b', { key: 'b' }, 'bold'),
            ' and this text is ',
            React.createElement('i', { key: 'c' }, 'italic'),
            '.',
        ]);

        const expected = React.createElement('span', { key: 'a', foo: 'bar' }, [
            'Dieser Text ist ',
            React.createElement('i', { key: 'c' }, 'kursiv'),
            ' und dieser Text ist ',
            React.createElement('b', { key: 'b' }, 'fett'),
            '.',
        ]);

        const c = new Composition(el);
        expect(c.decompose('<c0>Dieser Text ist <c2>kursiv</c2> und dieser Text ist <c1>fett</c1>.</c0>')).toEqual(
            expected,
        );
    });

    test('Decompose with added named f elements', () => {
        const el = React.createElement('span', { key: 'a' }, [
            'This is a test of the ',
            React.createElement('b', { key: 'b' }, ['emergency [[type]] system']),
            '. This is only a test.',
        ]);

        const expected = React.createElement('span', { key: 'a' }, [
            'Dies ist ein Test des ',
            React.createElement('b', { key: 'b' }, [
                'Notfall-',
                React.createElement('i', { key: 'c' }, 'Broadcast'),
                '-Systems',
            ]),
            '. Dies ist nur ein Test.',
        ]);

        const c = new Composition(el);
        c.addElement('f0', React.createElement('i', { key: 'c' }, 'Broadcast'));
        expect(
            c.decompose('<c0>Dies ist ein Test des <c1>Notfall-<f0></f0>-Systems</c1>. Dies ist nur ein Test.</c0>'),
        ).toEqual(expected);
    });

    test('Decompose with added named e elements', () => {
        const el = React.createElement('span', { key: 'a' }, [
            'This is a test of the ',
            React.createElement('b', { key: 'b' }, ['emergency [[type]] system']),
            '. This is only a test.',
        ]);

        const expected = React.createElement('span', { key: 'a' }, [
            'Dies ist ein Test des ',
            React.createElement('b', { key: 'b' }, [
                'Notfall-',
                React.createElement('i', { key: 'c' }, 'Broadcast'),
                '-Systems',
            ]),
            '. Dies ist nur ein Test.',
        ]);

        const c = new Composition(el);
        c.addElement('e0', React.createElement('i', { key: 'c' }, 'Broadcast'));
        expect(
            c.decompose('<c0>Dies ist ein Test des <c1>Notfall-<e0></e0>-Systems</c1>. Dies ist nur ein Test.</c0>'),
        ).toEqual(expected);
    });
});
