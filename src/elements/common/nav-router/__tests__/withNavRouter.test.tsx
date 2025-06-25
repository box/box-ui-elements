import * as React from 'react';
import { render } from '@testing-library/react';
import withNavRouter from '../withNavRouter';
import { WithNavRouterProps } from '../types';

jest.mock('../NavRouter', () => ({ children }: { children: React.ReactNode }) => (
    <div data-testid="nav-router-wrapper">{children}</div>
));

type Props = {
    value?: string;
};

describe('src/eleemnts/common/nav-router/withNavRouter', () => {
    const TestComponent = ({ value }: Props) => <div data-testid="test-component">{`Test ${value}`}</div>;
    const WrappedComponent = withNavRouter(TestComponent);

    const renderComponent = (props?: Props & WithNavRouterProps) => 
        render(<WrappedComponent {...props} />);

    test('should wrap component with NavRouter', () => {
        const { getByTestId } = renderComponent();

        expect(getByTestId('test-component')).toBeInTheDocument();
        expect(getByTestId('test-component')).toHaveTextContent('Test undefined');
        expect(getByTestId('nav-router-wrapper')).toBeInTheDocument();
    });

    test('should pass props to wrapped component', () => {
        const { getByTestId } = renderComponent({ value: 'test-value' });

        expect(getByTestId('test-component')).toBeInTheDocument();
        expect(getByTestId('test-component')).toHaveTextContent('Test test-value');
    });

    describe('when routerDisabled feature flag is enabled', () => {
        test('should return unwrapped component when feature flag is true', () => {
            const features = { routerDisabled: { value: true } };
            const { getByTestId, queryByTestId } = renderComponent({ features });

            expect(getByTestId('test-component')).toBeInTheDocument();
            expect(getByTestId('test-component')).toHaveTextContent('Test undefined');
            expect(queryByTestId('nav-router-wrapper')).not.toBeInTheDocument();
        });

        test('should pass features prop to NavRouter when router is enabled', () => {
            const features = { routerDisabled: { value: false } };
            const { getByTestId } = renderComponent({ features });

            expect(getByTestId('test-component')).toBeInTheDocument();
            expect(getByTestId('test-component')).toHaveTextContent('Test undefined');
            expect(getByTestId('nav-router-wrapper')).toBeInTheDocument();
        });


    });
});
