import React from 'react';
import noop from 'lodash/noop';
import { mount } from 'enzyme';
import { PreviewNavigationComponent as PreviewNavigation } from '../PreviewNavigation';

const historyMock = {
    location: { pathname: '/activity/tasks/1234', hash: '' },
    listen: jest.fn(),
    push: jest.fn(),
    entries: [{}],
};

const getWrapper = ({ onNavigateLeft = noop, onNavigateRight = noop, ...rest }) =>
    mount(
        <PreviewNavigation
            intl={{
                formatMessage: jest.fn(),
            }}
            onNavigateLeft={onNavigateLeft}
            onNavigateRight={onNavigateRight}
            history={historyMock}
            {...rest}
        />,
    );

afterEach(() => {
    jest.resetAllMocks();
});

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

        test('should render left navigation correctly from tasks deeplinked URL', () => {
            const onNavigateLeftMock = jest.fn();
            const wrapper = mount(
                <PreviewNavigation
                    intl={{
                        formatMessage: jest.fn(),
                    }}
                    collection={['a', 'b', 'c']}
                    currentIndex={2}
                    onNavigateLeft={onNavigateLeftMock}
                    onNavigateRight={jest.fn()}
                    history={historyMock}
                />,
            );
            expect(wrapper.find('PlainButton')).toHaveLength(1);
            wrapper.find('PlainButton').simulate('click');

            expect(historyMock.push).toBeCalledTimes(1);
            expect(historyMock.push).toBeCalledWith('/activity');
            expect(onNavigateLeftMock).toHaveBeenCalled();
        });

        test('should render right navigation correctly from tasks deeplinked URL ', () => {
            const onNavigateRightMock = jest.fn();
            const wrapper = mount(
                <PreviewNavigation
                    intl={{
                        formatMessage: jest.fn(),
                    }}
                    collection={['a', 'b', 'c']}
                    currentIndex={0}
                    onNavigateLeft={jest.fn()}
                    onNavigateRight={onNavigateRightMock}
                    history={historyMock}
                />,
            );
            expect(wrapper.find('PlainButton')).toHaveLength(1);
            wrapper.find('PlainButton').simulate('click');

            expect(historyMock.push).toBeCalledTimes(1);
            expect(historyMock.push).toBeCalledWith('/activity');
            expect(onNavigateRightMock).toHaveBeenCalled();
        });
        test('should render navigation correctly from comments deeplinked URL ', () => {
            const onNavigateRightMock = jest.fn();
            const wrapper = mount(
                <PreviewNavigation
                    intl={{
                        formatMessage: jest.fn(),
                    }}
                    collection={['a', 'b', 'c']}
                    currentIndex={0}
                    onNavigateLeft={jest.fn()}
                    onNavigateRight={onNavigateRightMock}
                    history={historyMock}
                />,
            );
            expect(wrapper.find('PlainButton')).toHaveLength(1);
            wrapper.find('PlainButton').simulate('click');

            expect(historyMock.push).toBeCalledTimes(1);
            expect(historyMock.push).toBeCalledWith('/activity');
            expect(onNavigateRightMock).toHaveBeenCalled();
        });
    });
});
