import * as React from 'react';
import { render } from '../../../test-utils/testing-library';
import { type BlueprintAnimationsProps, withBlueprintAnimations } from '../withBlueprintAnimations';

jest.mock('@box/blueprint-web', () => {
    const ReactMock = jest.requireActual('react');

    return {
        BlueprintProvider: ({ children, configurationOverrides }) =>
            ReactMock.createElement(
                'div',
                {
                    'data-testid': 'blueprint-animations-provider',
                    'data-animations-phase1': String(configurationOverrides?.animationsPhase1Enabled),
                    'data-animations-phase2': String(configurationOverrides?.animationsPhase2Enabled),
                },
                children,
            ),
        useNoopTreatment: () => 'control',
        TooltipProvider: ({ children }) =>
            ReactMock.createElement('div', { 'data-testid': 'tooltip-provider' }, children),
    };
});

type TestComponentProps = {
    value?: string;
} & BlueprintAnimationsProps;

describe('src/elements/common/withBlueprintAnimations', () => {
    const TestComponent = ({ value }: TestComponentProps) => (
        <div data-testid="test-component">{`Test ${value || 'default'}`}</div>
    );

    const WrappedComponent = withBlueprintAnimations(TestComponent);

    const renderComponent = (props?: TestComponentProps) => render(<WrappedComponent {...props} />);

    test('should enable Blueprint animations by default', () => {
        const { getByTestId } = renderComponent();

        expect(getByTestId('test-component')).toHaveTextContent('Test default');
        expect(getByTestId('blueprint-animations-provider')).toHaveAttribute('data-animations-phase1', 'true');
        expect(getByTestId('blueprint-animations-provider')).toHaveAttribute('data-animations-phase2', 'true');
    });

    test('should opt out when animationsEnabled is false', () => {
        const { getByTestId } = renderComponent({ animationsEnabled: false });

        expect(getByTestId('blueprint-animations-provider')).toHaveAttribute('data-animations-phase1', 'false');
        expect(getByTestId('blueprint-animations-provider')).toHaveAttribute('data-animations-phase2', 'false');
    });

    test('should enable all phases when animationsEnabled is true', () => {
        const { getByTestId } = renderComponent({ animationsEnabled: true });

        expect(getByTestId('blueprint-animations-provider')).toHaveAttribute('data-animations-phase1', 'true');
        expect(getByTestId('blueprint-animations-provider')).toHaveAttribute('data-animations-phase2', 'true');
    });

    test('should honor per-phase overrides matching Blueprint configurationOverrides keys', () => {
        const { getByTestId } = renderComponent({
            animationsEnabled: {
                animationsPhase1Enabled: true,
                animationsPhase2Enabled: false,
            },
        });

        expect(getByTestId('blueprint-animations-provider')).toHaveAttribute('data-animations-phase1', 'true');
        expect(getByTestId('blueprint-animations-provider')).toHaveAttribute('data-animations-phase2', 'false');
    });

    test('should default omitted phase keys to on when an object is passed', () => {
        const { getByTestId } = renderComponent({
            animationsEnabled: {
                animationsPhase2Enabled: false,
            },
        });

        expect(getByTestId('blueprint-animations-provider')).toHaveAttribute('data-animations-phase1', 'true');
        expect(getByTestId('blueprint-animations-provider')).toHaveAttribute('data-animations-phase2', 'false');
    });

    test('should pass props to wrapped component', () => {
        const { getByTestId } = renderComponent({ value: 'test-value' });

        expect(getByTestId('test-component')).toHaveTextContent('Test test-value');
    });

    test('should not forward animationsEnabled to the wrapped component', () => {
        const DomFacingComponent = ({ value, ...rest }: TestComponentProps & Record<string, unknown>) => (
            <div data-testid="dom-facing" {...rest}>
                {value}
            </div>
        );
        const WrappedDomFacing = withBlueprintAnimations(DomFacingComponent);

        const { getByTestId } = render(<WrappedDomFacing value="ok" animationsEnabled={false} data-extra="keep" />);

        expect(getByTestId('dom-facing')).not.toHaveAttribute('animationsEnabled');
        expect(getByTestId('dom-facing')).toHaveAttribute('data-extra', 'keep');
        expect(getByTestId('blueprint-animations-provider')).toHaveAttribute('data-animations-phase1', 'false');
    });
});
