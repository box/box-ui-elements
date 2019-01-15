import React from 'react';
import noop from 'lodash/noop';
import { shallow } from 'enzyme';
import { PreviewNavigationComponent as PreviewNavigation } from '../PreviewNavigation';

const getWrapper = ({ onNavigateLeft = noop, onNavigateRight = noop, ...rest }) =>
    shallow(
        <PreviewNavigation
            intl={{
                formatMessage: jest.fn(),
            }}
            onNavigateLeft={onNavigateLeft}
            onNavigateRight={onNavigateRight}
            {...rest}
        />,
    );

describe('elements/content-preview/PreviewNavigation', () => {
    describe('render()', () => {
        test('should render correctly with an empty collection', () => {
            const wrapper = getWrapper({ collection: [], currentIndex: 0 });
            expect(wrapper).toMatchSnapshot();
        });

        test.each`
            currentIndex
            ${0}
            ${1}
            ${9}
        `('should render correctly with a filled collection', ({ currentIndex }) => {
            const collection = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
            const wrapper = getWrapper({ collection, currentIndex });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
