import * as React from 'react';
import { BlueprintModernizationContext } from '@box/blueprint-web';
import { render } from '../../../test-utils/testing-library';
import { withBlueprintModernization } from '../withBlueprintModernization';

// Mock the Blueprint Web package with simple components
jest.mock('@box/blueprint-web', () => {
    const ReactMock = jest.requireActual('react');
    const mockContext = ReactMock.createContext({ enableModernizedComponents: false });

    return {
        BlueprintModernizationContext: mockContext,
        BlueprintModernizationProvider: ({ children, enableModernizedComponents }) =>
            ReactMock.createElement(
                'div',
                {
                    'data-testid': 'blueprint-provider',
                    'data-enabled': String(enableModernizedComponents),
                },
                children,
            ),
        TooltipProvider: ({ children }) =>
            ReactMock.createElement('div', { 'data-testid': 'tooltip-provider' }, children),
        BlueprintModernizationContextValue: {},
    };
});

type TestComponentProps = {
    value?: string;
    enableModernizedComponents?: boolean;
};

describe('src/elements/common/withBlueprintModernization', () => {
    const TestComponent = ({ value }: TestComponentProps) => (
        <div data-testid="test-component">{`Test ${value || 'default'}`}</div>
    );

    const WrappedComponent = withBlueprintModernization(TestComponent);

    const renderComponent = (props?: TestComponentProps) => render(<WrappedComponent {...props} />);

    test('should wrap component with BlueprintModernizationProvider', () => {
        const { getByTestId } = renderComponent();

        expect(getByTestId('test-component')).toBeInTheDocument();
        expect(getByTestId('test-component')).toHaveTextContent('Test default');
        expect(getByTestId('blueprint-provider')).toBeInTheDocument();
        expect(getByTestId('blueprint-provider')).toHaveAttribute('data-enabled', 'false');
    });

    test('should pass props to wrapped component', () => {
        const { getByTestId } = renderComponent({ value: 'test-value' });

        expect(getByTestId('test-component')).toBeInTheDocument();
        expect(getByTestId('test-component')).toHaveTextContent('Test test-value');
    });

    test('should handle enableModernizedComponents prop', () => {
        const { getByTestId } = renderComponent({
            value: 'modernized',
            enableModernizedComponents: true,
        });

        expect(getByTestId('test-component')).toBeInTheDocument();
        expect(getByTestId('test-component')).toHaveTextContent('Test modernized');
        expect(getByTestId('blueprint-provider')).toBeInTheDocument();
        expect(getByTestId('blueprint-provider')).toHaveAttribute('data-enabled', 'true');
    });

    test('should not wrap component when upstream BlueprintModernizationProvider exists', () => {
        // Create a parent component with existing BlueprintModernizationContext
        const ParentWithContext = ({ children }) => (
            <BlueprintModernizationContext.Provider value={{ enableModernizedComponents: true }}>
                {children}
            </BlueprintModernizationContext.Provider>
        );

        const { getByTestId, queryByTestId } = render(
            <ParentWithContext>
                <WrappedComponent value="with-context" enableModernizedComponents={false} />
            </ParentWithContext>,
        );

        // Component should render
        expect(getByTestId('test-component')).toBeInTheDocument();
        expect(getByTestId('test-component')).toHaveTextContent('Test with-context');

        // HOC should NOT add its own BlueprintModernizationProvider since upstream context exists
        expect(queryByTestId('blueprint-provider')).not.toBeInTheDocument();
    });
});
