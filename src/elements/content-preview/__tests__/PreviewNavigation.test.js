import * as React from 'react';
import { Router } from 'react-router-dom';
import noop from 'lodash/noop';
import { render, screen, userEvent } from '../../../test-utils/testing-library';
import PreviewNavigation from '../PreviewNavigation';
import { ViewType, FeedEntryType } from '../../common/types/SidebarNavigation';

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
};

const renderComponentWithRouter = (props = {}) => {
    const {
        collection = ['a', 'b', 'c'],
        historyMock = historyMockDefault,
        onNavigateLeft = noop,
        onNavigateRight = noop,
        ...rest
    } = props;

    return render(
        <Router history={historyMock}>
            <PreviewNavigation
                collection={collection}
                onNavigateLeft={onNavigateLeft}
                onNavigateRight={onNavigateRight}
                {...rest}
            />
        </Router>,
    );
};

const renderComponentWithoutRouter = (props = {}) => {
    const defaultProps = {
        collection: ['a', 'b', 'c'],
        currentIndex: 1,
        onNavigateLeft: noop,
        onNavigateRight: noop,
    };

    return render(<PreviewNavigation {...defaultProps} {...props} routerDisabled />);
};

beforeEach(() => {
    jest.resetAllMocks();
});

describe('elements/content-preview/PreviewNavigation', () => {
    describe('render()', () => {
        test('should render correctly with an empty collection', () => {
            const { container } = renderComponentWithRouter({ collection: [], currentIndex: 0 });
            expect(container.firstChild).toBeNull();
        });

        test.each([
            { currentIndex: 0, description: 'first item', expectLeft: false, expectRight: true },
            { currentIndex: 1, description: 'middle item', expectLeft: true, expectRight: true },
            { currentIndex: 9, description: 'last item', expectLeft: true, expectRight: false },
        ])(
            'should render correctly with a filled collection - $description',
            ({ currentIndex, expectLeft, expectRight }) => {
                const collection = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
                renderComponentWithRouter({ collection, currentIndex });

                const leftButton = screen.queryByTestId('preview-navigation-left');
                const rightButton = screen.queryByTestId('preview-navigation-right');

                if (expectLeft) {
                    expect(leftButton).toBeInTheDocument();
                } else {
                    expect(leftButton).not.toBeInTheDocument();
                }

                if (expectRight) {
                    expect(rightButton).toBeInTheDocument();
                } else {
                    expect(rightButton).not.toBeInTheDocument();
                }
            },
        );

        test('should render left navigation correctly from tasks deeplinked URL', async () => {
            const onNavigateLeftMock = jest.fn();
            const user = userEvent();

            renderComponentWithRouter({
                currentIndex: 2,
                onNavigateLeft: onNavigateLeftMock,
                historyMock: historyMockDefault,
            });

            const leftButton = screen.getByTestId('preview-navigation-left');
            expect(leftButton).toBeInTheDocument();

            await user.click(leftButton);

            expect(historyMockDefault.push).toHaveBeenCalledTimes(1);
            expect(historyMockDefault.push).toHaveBeenCalledWith('/activity');
            expect(onNavigateLeftMock).toHaveBeenCalled();
        });

        test('should render right navigation correctly from tasks deeplinked URL', async () => {
            const onNavigateRightMock = jest.fn();
            const user = userEvent();

            renderComponentWithRouter({
                currentIndex: 0,
                onNavigateRight: onNavigateRightMock,
                historyMock: historyMockDefault,
            });

            const rightButton = screen.getByTestId('preview-navigation-right');
            expect(rightButton).toBeInTheDocument();

            await user.click(rightButton);

            expect(historyMockDefault.push).toHaveBeenCalledTimes(1);
            expect(historyMockDefault.push).toHaveBeenCalledWith('/activity');
            expect(onNavigateRightMock).toHaveBeenCalled();
        });

        test('should render right navigation correctly from metadata deeplinked URL', async () => {
            const onNavigateRightMock = jest.fn();
            const user = userEvent();

            renderComponentWithRouter({
                currentIndex: 0,
                historyMock: deeplinkedMetadataHistoryMock,
                onNavigateRight: onNavigateRightMock,
            });

            const rightButton = screen.getByTestId('preview-navigation-right');
            expect(rightButton).toBeInTheDocument();

            await user.click(rightButton);

            expect(deeplinkedMetadataHistoryMock.push).toHaveBeenCalledTimes(1);
            expect(deeplinkedMetadataHistoryMock.push).toHaveBeenCalledWith('/metadata/filteredTemplates/123,124');
            expect(onNavigateRightMock).toHaveBeenCalled();
        });

        test('should render left navigation correctly from metadata deeplinked URL', async () => {
            const onNavigateLeftMock = jest.fn();
            const user = userEvent();

            renderComponentWithRouter({
                currentIndex: 2,
                historyMock: deeplinkedMetadataHistoryMock,
                onNavigateLeft: onNavigateLeftMock,
            });

            const leftButton = screen.getByTestId('preview-navigation-left');
            expect(leftButton).toBeInTheDocument();

            await user.click(leftButton);

            expect(deeplinkedMetadataHistoryMock.push).toHaveBeenCalledTimes(1);
            expect(deeplinkedMetadataHistoryMock.push).toHaveBeenCalledWith('/metadata/filteredTemplates/123,124');
            expect(onNavigateLeftMock).toHaveBeenCalled();
        });
    });

    describe('when routerDisabled is true', () => {
        const mockNavigationHandler = jest.fn();
        const onNavigateLeftMock = jest.fn();
        const onNavigateRightMock = jest.fn();

        test('should render correctly without router', () => {
            renderComponentWithoutRouter({ currentIndex: 1 });

            expect(screen.getByTestId('preview-navigation-left')).toBeInTheDocument();
            expect(screen.getByTestId('preview-navigation-right')).toBeInTheDocument();
        });

        test('should call internalSidebarNavigationHandler when left navigation button is clicked', async () => {
            const mockInternalSidebarNavigation = {
                sidebar: ViewType.ACTIVITY,
                activeFeedEntryType: FeedEntryType.COMMENTS,
                activeFeedEntryId: '123',
            };
            const user = userEvent();

            renderComponentWithoutRouter({
                internalSidebarNavigationHandler: mockNavigationHandler,
                internalSidebarNavigation: mockInternalSidebarNavigation,
                onNavigateLeft: onNavigateLeftMock,
            });

            const leftButton = screen.getByTestId('preview-navigation-left');
            await user.click(leftButton);

            expect(mockNavigationHandler).toHaveBeenCalledTimes(1);
            expect(mockNavigationHandler).toHaveBeenCalledWith({ sidebar: ViewType.ACTIVITY });
            expect(onNavigateLeftMock).toHaveBeenCalledTimes(1);
            expect(onNavigateRightMock).not.toHaveBeenCalled();
        });

        test('should call internalSidebarNavigationHandler when right navigation button is clicked', async () => {
            const mockInternalSidebarNavigation = {
                sidebar: ViewType.ACTIVITY,
                activeFeedEntryType: FeedEntryType.COMMENTS,
                activeFeedEntryId: '123',
            };
            const user = userEvent();

            renderComponentWithoutRouter({
                internalSidebarNavigationHandler: mockNavigationHandler,
                internalSidebarNavigation: mockInternalSidebarNavigation,
                onNavigateRight: onNavigateRightMock,
            });

            const rightButton = screen.getByTestId('preview-navigation-right');
            await user.click(rightButton);

            expect(mockNavigationHandler).toHaveBeenCalledTimes(1);
            expect(mockNavigationHandler).toHaveBeenCalledWith({ sidebar: ViewType.ACTIVITY });
            expect(onNavigateRightMock).toHaveBeenCalledTimes(1);
            expect(onNavigateLeftMock).not.toHaveBeenCalled();
        });

        test('should call navigation handler with metadata deeplinks when left navigation button is clicked', async () => {
            const mockInternalSidebarNavigation = {
                sidebar: ViewType.METADATA,
                filteredTemplateIds: '123,124',
            };
            const user = userEvent();

            renderComponentWithoutRouter({
                internalSidebarNavigationHandler: mockNavigationHandler,
                internalSidebarNavigation: mockInternalSidebarNavigation,
                onNavigateLeft: onNavigateLeftMock,
            });

            const leftButton = screen.getByTestId('preview-navigation-left');
            await user.click(leftButton);

            expect(mockNavigationHandler).toHaveBeenCalledTimes(1);
            expect(mockNavigationHandler).toHaveBeenCalledWith({
                sidebar: ViewType.METADATA,
                filteredTemplateIds: '123,124',
            });
            expect(onNavigateLeftMock).toHaveBeenCalledTimes(1);
            expect(onNavigateRightMock).not.toHaveBeenCalled();
        });

        test('should call navigation handler with metadata deeplinks when right navigation button is clicked', async () => {
            const mockInternalSidebarNavigation = {
                sidebar: ViewType.METADATA,
                filteredTemplateIds: '123,124',
            };
            const user = userEvent();

            renderComponentWithoutRouter({
                internalSidebarNavigationHandler: mockNavigationHandler,
                internalSidebarNavigation: mockInternalSidebarNavigation,
                onNavigateRight: onNavigateRightMock,
            });

            const rightButton = screen.getByTestId('preview-navigation-right');
            await user.click(rightButton);

            expect(mockNavigationHandler).toHaveBeenCalledTimes(1);
            expect(mockNavigationHandler).toHaveBeenCalledWith({
                sidebar: ViewType.METADATA,
                filteredTemplateIds: '123,124',
            });
            expect(onNavigateRightMock).toHaveBeenCalledTimes(1);
            expect(onNavigateLeftMock).not.toHaveBeenCalled();
        });
    });
});
