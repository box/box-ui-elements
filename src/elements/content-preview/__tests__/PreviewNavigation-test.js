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
        // test('should render left navigation correctly from deeplinked URL', () => {
        //     const onNavigateLeftMock = jest.fn();
        //     const wrapper = getWrapper({ path: '/activity/tasks/12345', onNavigateLeft: onNavigateLeftMock });
        //     expect(wrapper.find('PlainButton')).to.have.lengthOf(1);
        //     expect(onNavigateLeftMock).toHaveBeenCalled();
        //     expect(wrapper.find('Route').props()).toMatchObject({
        //         path: '/activity',
        //     });
        // });
    });

    // describe('activity sidebar', () => {
    //     test('should render with comments deeplink', () => {
    //         const wrapper = getWrapper({ path: '/activity/comments/12345' });
    //         expect(wrapper.find('ActivitySidebar').props()).toMatchObject({
    //             activeFeedEntryType: 'comment',
    //             activeFeedEntryId: '12345',
    //         });
    //     });

    //     test('should render with versions deeplink', () => {
    //         const wrapper = getWrapper({ path: '/activity/versions/12345' });
    //         expect(wrapper.find('VersionsSidebar').props()).toMatchObject({
    //             versionId: '12345',
    //         });
    //     });
    // });
});
