import React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import NavRouter from '../index';
import { withNavRouter, WithNavRouterProps } from '../withNavRouter';

type Props = {
    value?: string;
};

describe('src/eleemnts/common/nav-router/withNavRouter', () => {
    const TestComponent = ({ value }: Props) => <div>{`Test ${value}`}</div>;
    const WrappedComponent = withNavRouter(TestComponent);

    const getWrapper = (props?: Props & WithNavRouterProps) => shallow(<WrappedComponent {...props} />);

    test('should wrap component with NavRouter', () => {
        const wrapper = getWrapper();

        expect(wrapper.find(NavRouter)).toBeTruthy();
        expect(wrapper.find(TestComponent)).toBeTruthy();
    });

    test('should provide the appropriate props to NavRouter and the wrapped component', () => {
        const history = createMemoryHistory();
        const mockFn = jest.fn();
        const initialEntries = ['foo'];
        const initialIndex = 1;
        const keyLength = 2;
        const value = 'foo';
        const wrapper = getWrapper({
            getUserConfirmation: mockFn,
            history,
            initialEntries,
            initialIndex,
            keyLength,
            value,
        });

        const navRouter = wrapper.find(NavRouter);
        expect(navRouter.prop('getUserConfirmation')).toEqual(mockFn);
        expect(navRouter.prop('history')).toEqual(history);
        expect(navRouter.prop('initialEntries')).toEqual(initialEntries);
        expect(navRouter.prop('initialIndex')).toEqual(initialIndex);
        expect(navRouter.prop('keyLength')).toEqual(keyLength);

        expect(wrapper.find(TestComponent).prop('value')).toEqual(value);
    });
});
