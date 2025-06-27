// @flow
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '../../../../test-utils/testing-library';
import withRouterAndRef from '../withRouterAndRef';

describe('elements/common/routing/withRouterAndRef', () => {
    type Props = {
        value: string,
        routerDisabled?: boolean,
    };

    const TestComponent = React.forwardRef(({ value, staticContext, routerDisabled, ...props }: Props, ref) => (
        <div ref={ref} data-testid="test-component" data-router-disabled={routerDisabled} {...props}>
            {value}
        </div>
    ));
    TestComponent.displayName = 'TestComponent';
    
    const WithRouterComponent = withRouterAndRef(TestComponent);

    describe('router enabled (default)', () => {
        test('should pass ref and router props to wrapped component', () => {
            const ref = React.createRef();
            const { getByTestId } = render(
                <MemoryRouter initialEntries={['/test']}>
                    <WithRouterComponent ref={ref} value="test" />
                </MemoryRouter>,
            );
            
            const element = getByTestId('test-component');
            expect(ref.current).toBe(element);
            expect(element).toHaveTextContent('test');
            expect(element).not.toHaveAttribute('data-router-disabled');
        });
    });

    describe('router disabled', () => {
        test('should pass ref down to wrapped component without router', () => {
            const ref = React.createRef();
            const { getByTestId } = render(
                <WithRouterComponent ref={ref} value="foo" routerDisabled />
            );
            
            const element = getByTestId('test-component');
            expect(ref.current).toBe(element);
            expect(element).toHaveTextContent('foo');
            expect(element).toHaveAttribute('data-router-disabled', 'true');
        });

        test('should render component directly without Route wrapper', () => {
            const { getByTestId } = render(
                <WithRouterComponent value="direct" routerDisabled />
            );
            
            const element = getByTestId('test-component');
            expect(element).toHaveTextContent('direct');
            expect(element).toHaveAttribute('data-router-disabled', 'true');
        });

        test('should pass through all props including routerDisabled', () => {
            const { getByTestId } = render(
                <WithRouterComponent 
                    value="test" 
                    routerDisabled 
                    data-custom="custom-value"
                    className="test-class"
                />
            );
            
            const element = getByTestId('test-component');
            expect(element).toHaveTextContent('test');
            expect(element).toHaveAttribute('data-custom', 'custom-value');
            expect(element).toHaveClass('test-class');
            expect(element).toHaveAttribute('data-router-disabled', 'true');
        });
    });
});
