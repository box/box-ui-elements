import * as React from 'react';
import { mount } from 'enzyme';
import noop from 'lodash/noop';
import CustomRouter from '../../common/routing/customRouter';
import { PreviewNavigationComponent as PreviewNavigation } from '../PreviewNavigation';

const historyMockDefault = {
    location: { pathname: '/activity/tasks/1234', hash: '' },
    listen: jest.fn(),
    push: jest.fn(),
    entries: [{}],
};

const deeplinkedMetadataHistoryMock = {
    location: { pathname: '/metadata/filteredTemplates/123,124', hash: '' },
    listen: jest.fn(),
    push: jest.fn(),
    entries: [{}],
    match: {
        params: {
            activeTab: 'metadata',
            deeplink: 'filteredTemplates',
            filteredTemplateIds: '123,124',
            0: '',
        },
        path: '/:activeTab/:deeplink/:filteredTemplateIds?',
        url: '/metadata/filteredTemplates/123,124',
        isExact: true,
    },
};

const getWrapper = ({
    collection = ['a', 'b', 'c'],
    historyMock = historyMockDefault,
    onNavigateLeft = noop,
    onNavigateRight = noop,
    ...rest
}) => {
    const { pathname } = historyMock.location;
    const pathParts = pathname.split('/').filter(Boolean);
    const isMetadataPath = pathname.includes('filteredTemplates');
    const filteredIds = isMetadataPath && pathParts[2] ? pathParts[2].split(',') : [];

    // Create a new history mock that handles both metadata and non-metadata paths
    const newHistoryMock = {
        ...historyMock,
        push: jest.fn(path => {
            // For metadata paths, preserve the filteredTemplateIds in the URL
            if (isMetadataPath && filteredIds.length) {
                return `/metadata/filteredTemplates/${filteredIds.join(',')}`;
            }
            // For non-metadata paths, use the provided path
            return path;
        }),
    };

    const routerContext = {
        history: newHistoryMock,
        location: historyMock.location,
        match: {
            params: {
                activeTab: pathParts[0] || '',
                deeplink: pathParts[1] || '',
                fileVersionId: !isMetadataPath ? pathParts[2] : '',
                activeFeedEntryId: !isMetadataPath ? pathParts[3] : '',
                filteredTemplateIds: filteredIds,
                0: pathParts.slice(3).join('/') || '',
            },
            path: isMetadataPath
                ? '/:activeTab/:deeplink/:filteredTemplateIds?'
                : '/:activeTab/:deeplink/:fileVersionId?/:activeFeedEntryId?',
            url: pathname,
            isExact: true,
        },
    };

    return mount(
        <CustomRouter {...routerContext}>
            <PreviewNavigation
                collection={collection}
                intl={{
                    formatMessage: jest.fn(),
                }}
                onNavigateLeft={onNavigateLeft}
                onNavigateRight={onNavigateRight}
                {...rest}
            />
        </CustomRouter>,
    );
};

afterEach(() => {
    jest.resetAllMocks();
});

describe('elements/content-preview/PreviewNavigation', () => {
    describe('render()', () => {
        test('should render correctly with an empty collection', () => {
            const wrapper = getWrapper({ collection: [], currentIndex: 0 });
            expect(wrapper).toMatchSnapshot();
        });

        test.each([0, 1, 9])('should render correctly with a filled collection %i', ({ currentIndex }) => {
            const collection = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
            const wrapper = getWrapper({ collection, currentIndex });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render left navigation correctly from tasks deeplinked URL', () => {
            const onNavigateLeftMock = jest.fn();
            const wrapper = getWrapper({ currentIndex: 2, onNavigateLeft: onNavigateLeftMock });

            const previewNav = wrapper.find(PreviewNavigation);
            const button = previewNav.find('PlainButton');
            expect(button).toHaveLength(1);
            button.simulate('click');

            const { history } = wrapper.find(CustomRouter).props();
            expect(history.push).toBeCalledTimes(1);
            expect(history.push).toBeCalledWith('/activity');
            expect(onNavigateLeftMock).toHaveBeenCalled();
        });

        test('should render right navigation correctly from tasks deeplinked URL ', () => {
            const onNavigateRightMock = jest.fn();
            const wrapper = getWrapper({ currentIndex: 0, onNavigateRight: onNavigateRightMock });

            const previewNav = wrapper.find(PreviewNavigation);
            const button = previewNav.find('PlainButton');
            expect(button).toHaveLength(1);
            button.simulate('click');

            const { history } = wrapper.find(CustomRouter).props();
            expect(history.push).toBeCalledTimes(1);
            expect(history.push).toBeCalledWith('/activity');
            expect(onNavigateRightMock).toHaveBeenCalled();
        });
        test('should render navigation correctly from comments deeplinked URL ', () => {
            const onNavigateRightMock = jest.fn();
            const wrapper = getWrapper({ currentIndex: 0, onNavigateRight: onNavigateRightMock });

            const previewNav = wrapper.find(PreviewNavigation);
            const button = previewNav.find('PlainButton');
            expect(button).toHaveLength(1);
            button.simulate('click');

            const { history } = wrapper.find(CustomRouter).props();
            expect(history.push).toBeCalledTimes(1);
            expect(history.push).toBeCalledWith('/activity');
            expect(onNavigateRightMock).toHaveBeenCalled();
        });

        test('should render right navigation correctly from metadata deeplinked URL ', () => {
            const onNavigateRightMock = jest.fn();
            const wrapper = getWrapper({
                currentIndex: 0,
                historyMock: deeplinkedMetadataHistoryMock,
                onNavigateRight: onNavigateRightMock,
            });

            const previewNav = wrapper.find(PreviewNavigation);
            const button = previewNav.find('PlainButton');
            expect(button).toHaveLength(1);
            button.simulate('click');

            const { history } = wrapper.find(CustomRouter).props();
            expect(history.push).toBeCalledTimes(1);
            expect(history.push).toBeCalledWith('/metadata/filteredTemplates/123,124');
            expect(onNavigateRightMock).toHaveBeenCalled();
        });

        test('should render left navigation correctly from metadata deeplinked URL ', () => {
            const onNavigateLeftMock = jest.fn();
            const wrapper = getWrapper({
                currentIndex: 2,
                historyMock: deeplinkedMetadataHistoryMock,
                onNavigateLeft: onNavigateLeftMock,
            });

            const previewNav = wrapper.find(PreviewNavigation);
            const button = previewNav.find('PlainButton');
            expect(button).toHaveLength(1);
            button.simulate('click');

            const { history } = wrapper.find(CustomRouter).props();
            expect(history.push).toBeCalledTimes(1);
            expect(history.push).toBeCalledWith('/metadata/filteredTemplates/123,124');
            expect(onNavigateLeftMock).toHaveBeenCalled();
        });
    });
});
