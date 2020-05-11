import React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import NavRouter from '../NavRouter';
import withNavRouter from '../withNavRouter';
import { WithNavRouterProps } from '../types';

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
        const initialEntries = ['foo'];
        const value = 'foo';
        const wrapper = getWrapper({
            history,
            initialEntries,
            value,
        });

        const navRouter = wrapper.find(NavRouter);
        expect(navRouter.prop('history')).toEqual(history);
        expect(navRouter.prop('initialEntries')).toEqual(initialEntries);

        expect(wrapper.find(TestComponent).prop('value')).toEqual(value);
    });
});
