import * as React from 'react';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import NavRouter from '../NavRouter';
import withNavRouter from '../withNavRouter';

type Props = {
    value?: string;
};

describe('src/elements/common/nav-router/withNavRouter', () => {
    const TestComponent = ({ value, location }: Props & { location?: { pathname: string } }) => (
        <div>{`Test ${value} ${location?.pathname || ''}`}</div>
    );
    const WrappedComponent = withNavRouter(TestComponent);

    const renderComponent = (props?: Props) => {
        const history = createMemoryHistory();
        return render(
            <NavRouter history={history}>
                <WrappedComponent {...props} />
            </NavRouter>,
        );
    };

    test('should render wrapped component with router context', () => {
        renderComponent({ value: 'test' });
        expect(screen.getByText(/Test test/)).toBeInTheDocument();
    });

    test('should provide router props to wrapped component', () => {
        const history = createMemoryHistory({ initialEntries: ['/test-path'] });
        render(
            <NavRouter history={history}>
                <WrappedComponent value="test" />
            </NavRouter>,
        );
        expect(screen.getByText(/Test test \/test-path/)).toBeInTheDocument();
    });
});
