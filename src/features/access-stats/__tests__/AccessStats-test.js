import React from 'react';

import AccessStats from '../AccessStats';

describe('features/access-stats/AccessStats', () => {
    const getWrapper = (props = {}) => shallow(<AccessStats {...props} />);

    test('should render access stats properly with error message', () => {
        const wrapper = getWrapper({ errorMessage: 'errorMessage' });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render access stats properly with open access stats modal handler', () => {
        const wrapper = getWrapper({
            openAccessStatsModal: () => {},
            previewCount: 1,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render access stats properly without error message', () => {
        const wrapper = getWrapper({ previewCount: 1 });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render access stats header properly when total events are more than max events', () => {
        const wrapper = getWrapper({ previewCount: 10000 });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render access stats properly when there are no events', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render view more button with extra props', () => {
        const wrapper = getWrapper({
            viewMoreButtonProps: {
                hi: 1,
            },
            openAccessStatsModal: () => {},
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render access stats list with extra props', () => {
        const wrapper = getWrapper({
            previewStatButtonProps: {
                resin: 1,
            },
        });

        expect(wrapper).toMatchSnapshot();
    });
});
