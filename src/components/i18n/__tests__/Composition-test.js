import React from 'react';

import Composition from '../Composition';

describe('components/i18n/Composition', () => {
    test('Compose strings to a string properly', () => {
        const c = new Composition('this is a test');
        expect(c.compose()).toEqual('this is a test');
    });

    test('Compose nulls to a empty string', () => {
        const c = new Composition(null);
        expect(c.compose()).toEqual('');
    });

    test('Compose undefined to an empty string', () => {
        const c = new Composition();
        expect(c.compose()).toEqual('');
    });

    test('Compose booleans to a string properly', () => {
        const c = new Composition(false);
        expect(c.compose()).toEqual('false');
    });

    test('Compose numbers to a string properly', () => {
        const c = new Composition(5.4);
        expect(c.compose()).toEqual('5.4');
    });

    test('Compose React elements with no children to an empty string', () => {
        const el = React.createElement('span', { key: 'a' });
        const c = new Composition(el);

        // nothing to translate, so no composed string
        expect(c.compose()).toEqual('');
    });

    test('Compose React elements that only have one child to a simple string', () => {
        const el = React.createElement('span', { key: 'a' }, 'foo');
        const c = new Composition(el);
        expect(c.compose()).toEqual('foo');
    });

    test('Compose React elements with two string children to a simple string', () => {
        const el = React.createElement('span', { key: 'a' }, ['foo', ' bar']);
        const c = new Composition(el);

        expect(c.compose()).toEqual('foo bar');
    });

    test('Compose React elements that have subchildren into a coded string', () => {
        const el = React.createElement('span', { key: 'a' }, [
            'This is a test of the ',
            React.createElement('b', { key: 'b' }, 'emergency broadcast system'),
            '. This is only a test.',
        ]);
        const c = new Composition(el);
        expect(c.compose()).toEqual('This is a test of the <c0>emergency broadcast system</c0>. This is only a test.');
    });

    test('Make sure you get the same thing when you compose twice', () => {
        const el = React.createElement('span', { key: 'a' }, [
            'This is a test of the ',
            React.createElement('b', { key: 'b' }, 'emergency broadcast system'),
            '. This is only a test.',
        ]);
        const c = new Composition(el);
        const expected = 'This is a test of the <c0>emergency broadcast system</c0>. This is only a test.';
        expect(c.compose()).toEqual(expected);
        expect(c.compose()).toEqual(expected); // should be the same the second time around too
    });

    test('Compose multiple subchildren into a coded string', () => {
        const el = React.createElement('span', { key: 'a' }, [
            'This is a test of the ',
            React.createElement('b', { key: 'b' }, 'emergency broadcast system'),
            '. This is ',
            React.createElement('b', { key: 'c' }, 'only'),
            ' a test.',
        ]);
        const c = new Composition(el);
        const expected = 'This is a test of the <c0>emergency broadcast system</c0>. This is <c1>only</c1> a test.';
        const actual = c.compose();
        expect(actual).toEqual(expected);
    });

    test('Compose properly with a complex set of nested subchildren to a coded string', () => {
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
        const expected = 'This is a test of the <c0>emergency <c1>broadcast</c1> system</c0>. This is only a test.';
        const actual = c.compose();
        expect(actual).toEqual(expected);
    });

    test('Compose properly with a complex set of nested subchildren at the beginning of the string to a coded string', () => {
        const el = React.createElement('span', { key: 'x' }, [
            React.createElement('b', { key: 'y' }, [
                'emergency ',
                React.createElement('i', { key: 'z' }, 'broadcast'),
                ' system',
            ]),
            '. This is only a test.',
        ]);

        const c = new Composition(el);
        const expected = '<c0>emergency <c1>broadcast</c1> system</c0>. This is only a test.';
        const actual = c.compose();
        expect(actual).toEqual(expected);
    });

    test('Decompose a React element with a string', () => {
        const c = new Composition('simple string');
        expect(c.decompose('einfache Zeichenfolge')).toEqual('einfache Zeichenfolge');
    });

    test('Decompose a React element with only one child', () => {
        const el = React.createElement('span', { key: 'a' }, 'simple string');

        const expected = React.createElement('span', { key: 'a' }, 'einfache Zeichenfolge');

        const c = new Composition(el);
        expect(c.decompose('einfache Zeichenfolge')).toEqual(expected);
    });

    test('Decompose a React element with subchildren', () => {
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
        expect(c.decompose('Dies ist ein Test des <c0>Notfall-Broadcast-Systems</c0>. Dies ist nur ein Test.')).toEqual(
            expected,
        );
    });

    test('Decompose with a complex set of children', () => {
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
            c.decompose('Dies ist ein Test des <c0>Notfall-<c1>Broadcast</c1>-Systems</c0>. Dies ist nur ein Test.'),
        ).toEqual(expected);
    });

    test('Decompose a React element with subchildren at the beginning of the string', () => {
        const el = React.createElement('span', { key: 'a' }, [
            React.createElement('b', { key: 'b' }, 'emergency broadcast system'),
            '. This is only a test.',
        ]);

        const expected = React.createElement('span', { key: 'a' }, [
            React.createElement('b', { key: 'b' }, 'Notfall-Broadcast-Systems'),
            '. Dies ist nur ein Test.',
        ]);

        const c = new Composition(el);
        expect(c.decompose('<c0>Notfall-Broadcast-Systems</c0>. Dies ist nur ein Test.')).toEqual(expected);
    });

    test('Make sure other properties are preserved while decomposing', () => {
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
            c.decompose('Dies ist ein Test des <c0>Notfall-<c1>Broadcast</c1>-Systems</c0>. Dies ist nur ein Test.'),
        ).toEqual(expected);
    });

    test('Make sure we can decompose if the translator rearranges components', () => {
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
        expect(c.decompose('Dieser Text ist <c1>kursiv</c1> und dieser Text ist <c0>fett</c0>.')).toEqual(expected);
    });

    test('Decompose with added parameter elements', () => {
        const el = React.createElement('span', { key: 'a' }, [
            'This is a test of the ',
            React.createElement('b', { key: 'b' }, [
                'emergency ',
                React.createElement('Param', { value: 'broadcast', description: 'test', key: 'c' }),
                ' system',
            ]),
            '. This is only a test.',
        ]);

        const expected = React.createElement('span', { key: 'a' }, [
            'Dies ist ein Test des ',
            React.createElement('b', { key: 'b' }, [
                'Notfall-',
                React.createElement('Param', { value: 'broadcast', description: 'test', key: 'c' }),
                '-Systems',
            ]),
            '. Dies ist nur ein Test.',
        ]);

        const c = new Composition(el);
        const actual = c.decompose('Dies ist ein Test des <c0>Notfall-<p0/>-Systems</c0>. Dies ist nur ein Test.');
        expect(actual).toEqual(expected);
    });

    test('Decompose while ensuring that only a minimal string is used', () => {
        const el = React.createElement('span', { key: 'a' }, [
            React.createElement('div', { key: 'x', className: 'asdf' }, [
                React.createElement('div', { key: 'y', className: 'asdfasdfasdf' }),
            ]),
            'This is a test of the ',
            React.createElement('b', { key: 'b' }, [
                'emergency ',
                React.createElement('Param', { value: 'broadcast', description: 'test', key: 'c' }),
                ' system',
            ]),
            '. This is only a test.',
        ]);

        const expected = React.createElement('span', { key: 'a' }, [
            React.createElement('div', { key: 'x', className: 'asdf' }, [
                React.createElement('div', { key: 'y', className: 'asdfasdfasdf' }),
            ]),
            'Dies ist ein Test des ',
            React.createElement('b', { key: 'b' }, [
                'Notfall-',
                React.createElement('Param', { value: 'broadcast', description: 'test', key: 'c' }),
                '-Systems',
            ]),
            '. Dies ist nur ein Test.',
        ]);

        const c = new Composition(el);
        const actual = c.decompose('Dies ist ein Test des <c0>Notfall-<p0/>-Systems</c0>. Dies ist nur ein Test.');
        expect(actual).toEqual(expected);
    });
});
