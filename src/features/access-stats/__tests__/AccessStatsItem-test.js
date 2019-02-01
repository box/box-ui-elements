import React from 'react';

import AccessStatsItem from '../AccessStatsItem';

describe('features/access-stats/AccessStatsItem', () => {
    const getWrapper = (props = {}) =>
        shallow(<AccessStatsItem count={100} statButtonProps={{}} type="preview" {...props} />);
    [
        {
            type: 'preview',
        },
        {
            type: 'view',
        },
        {
            type: 'download',
        },
        {
            type: 'comment',
        },
        {
            type: 'edit',
        },
    ].forEach(({ type }) => {
        test('should render access stats of type properly', () => {
            const wrapper = getWrapper({ type });

            expect(wrapper.contains('+')).toBe(false);
            expect(wrapper).toMatchSnapshot();
        });
    });

    test('should render access stats of preview type properly with modal', () => {
        const wrapper = getWrapper({
            type: 'preview',
            openAccessStatsModal: () => {},
            statButtonProps: { value: 1 },
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render access stats with a plus when count overflowed', () => {
        const wrapper = getWrapper({
            type: 'preview',
            openAccessStatsModal: () => {},
            statButtonProps: { value: 1 },
            hasCountOverflowed: true,
        });

        expect(wrapper.contains('+')).toBe(true);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render access stats with a zero count', () => {
        const wrapper = getWrapper({
            type: 'preview',
            count: 0,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
