import getPills from '../keywordUtils';

describe('components/ContentSidebar/keywordUtils/getPills', () => {
    test('should return correct pills for entries', () => {
        expect(
            getPills([
                {
                    type: 'text',
                    text: 'foo',
                },
                {
                    type: 'text',
                    text: 'bar',
                },
            ]),
        ).toEqual([
            {
                value: 0,
                text: 'foo',
            },
            {
                value: 1,
                text: 'bar',
            },
        ]);
    });
});
