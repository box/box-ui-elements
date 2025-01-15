import * as React from 'react';
import noop from 'lodash/noop';
import { createMemoryHistory } from 'history';
import { render, fireEvent, screen } from '../../../test-utils/testing-library';
import { NavRouter } from '../../common/nav-router';
import { PreviewNavigationComponent as PreviewNavigation } from '../PreviewNavigation.tsx';

const createHistoryMock = (pathname = '/activity/tasks/1234') => {
    const history = createMemoryHistory({ initialEntries: [pathname] });
    history.push = jest.fn();
    return history;
};

const renderComponent = ({
    collection = ['a', 'b', 'c'],
    pathname = '/activity/tasks/1234',
    onNavigateLeft = noop,
    onNavigateRight = noop,
    ...rest
}) => {
    const history = createHistoryMock(pathname);
    return render(
        <NavRouter history={history}>
            <PreviewNavigation
                collection={collection}
                intl={{
                    formatMessage: jest.fn(),
                }}
                onNavigateLeft={onNavigateLeft}
                onNavigateRight={onNavigateRight}
                history={history}
                {...rest}
            />
        </NavRouter>,
    );
};

afterEach(() => {
    jest.resetAllMocks();
});

describe('elements/content-preview/PreviewNavigation', () => {
    describe('render()', () => {
        test('should render nothing with an empty collection', () => {
            const { container } = renderComponent({ collection: [], currentIndex: 0 });
            expect(container.firstChild).toBeNull();
        });

        test.each([0, 1, 9])('should render correct navigation buttons for collection index %i', currentIndex => {
            const collection = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
            const { container } = renderComponent({ collection, currentIndex });
            const buttons = container.querySelectorAll('button');

            if (currentIndex === 0) {
                expect(buttons).toHaveLength(1);
                expect(buttons[0]).toHaveAttribute('title', expect.stringContaining('next'));
            } else if (currentIndex === collection.length - 1) {
                expect(buttons).toHaveLength(1);
                expect(buttons[0]).toHaveAttribute('title', expect.stringContaining('previous'));
            } else {
                expect(buttons).toHaveLength(2);
                expect(buttons[0]).toHaveAttribute('title', expect.stringContaining('previous'));
                expect(buttons[1]).toHaveAttribute('title', expect.stringContaining('next'));
            }
        });

        test('should handle left navigation correctly from tasks deeplinked URL', () => {
            const onNavigateLeftMock = jest.fn();
            const history = createHistoryMock('/activity/tasks/1234');
            renderComponent({
                currentIndex: 2,
                onNavigateLeft: onNavigateLeftMock,
                pathname: '/activity/tasks/1234',
            });

            const button = screen.getByRole('button', { name: /previous/i });
            expect(button).toBeInTheDocument();
            fireEvent.click(button);

            expect(history.push).toHaveBeenCalledWith('/activity');
            expect(onNavigateLeftMock).toHaveBeenCalled();
        });

        test('should handle right navigation correctly from tasks deeplinked URL', () => {
            const onNavigateRightMock = jest.fn();
            const history = createHistoryMock('/activity/tasks/1234');
            renderComponent({
                currentIndex: 0,
                onNavigateRight: onNavigateRightMock,
                pathname: '/activity/tasks/1234',
            });

            const button = screen.getByRole('button', { name: /next/i });
            expect(button).toBeInTheDocument();
            fireEvent.click(button);

            expect(history.push).toHaveBeenCalledWith('/activity');
            expect(onNavigateRightMock).toHaveBeenCalled();
        });
        test('should render navigation correctly from comments deeplinked URL ', () => {
            const onNavigateRightMock = jest.fn();
            renderComponent({ currentIndex: 0, onNavigateRight: onNavigateRightMock });

            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            fireEvent.click(button);

            expect(historyMockDefault.push).toBeCalledTimes(1);
            expect(historyMockDefault.push).toBeCalledWith('/activity');
            expect(onNavigateRightMock).toHaveBeenCalled();
        });

        test('should handle right navigation correctly from metadata deeplinked URL', () => {
            const onNavigateRightMock = jest.fn();
            const history = createHistoryMock('/metadata/filteredTemplates/123,124');
            renderComponent({
                currentIndex: 0,
                onNavigateRight: onNavigateRightMock,
                pathname: '/metadata/filteredTemplates/123,124',
            });

            const button = screen.getByRole('button', { name: /next/i });
            expect(button).toBeInTheDocument();
            fireEvent.click(button);

            expect(history.push).toHaveBeenCalledWith('/metadata/filteredTemplates/123,124');
            expect(onNavigateRightMock).toHaveBeenCalled();
        });

        test('should handle left navigation correctly from metadata deeplinked URL', () => {
            const onNavigateLeftMock = jest.fn();
            const history = createHistoryMock('/metadata/filteredTemplates/123,124');
            renderComponent({
                currentIndex: 2,
                onNavigateLeft: onNavigateLeftMock,
                pathname: '/metadata/filteredTemplates/123,124',
            });

            const button = screen.getByRole('button', { name: /previous/i });
            expect(button).toBeInTheDocument();
            fireEvent.click(button);

            expect(history.push).toHaveBeenCalledWith('/metadata/filteredTemplates/123,124');
            expect(onNavigateLeftMock).toHaveBeenCalled();
        });
    });
});
