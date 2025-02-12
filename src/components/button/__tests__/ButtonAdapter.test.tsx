import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import ButtonAdapter from '../ButtonAdapter';
import { ButtonType } from '../Button';

jest.mock('../../radar-button/RadarButton', () => ({
    __esModule: true,
    default: ({ children, ...props }: React.PropsWithChildren<{}>) => (
        <button type="button" data-testid="radar-button" {...props}>
            {children}
        </button>
    ),
}));

describe('components/button/ButtonAdapter', () => {
    test('renders button with default props', () => {
        render(<ButtonAdapter>Test Button</ButtonAdapter>);
        expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    test('applies isSelected prop as primary variant', () => {
        render(<ButtonAdapter isSelected>Selected Button</ButtonAdapter>);
        const button = screen.getByText('Selected Button');
        expect(button).toHaveAttribute('data-variant', 'primary');
    });

    test('handles setRef prop', () => {
        const setRef = jest.fn();
        render(<ButtonAdapter setRef={setRef}>Ref Button</ButtonAdapter>);
        expect(setRef).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });

    test('forwards ref', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<ButtonAdapter ref={ref}>Ref Button</ButtonAdapter>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    test('uses RadarButton when showRadar is true', () => {
        render(<ButtonAdapter showRadar>Radar Button</ButtonAdapter>);
        expect(screen.getByTestId('radar-button')).toBeInTheDocument();
    });

    test('passes correct button type', () => {
        render(<ButtonAdapter type={ButtonType.BUTTON}>Type Button</ButtonAdapter>);
        expect(screen.getByText('Type Button')).toHaveAttribute('type', 'button');
    });

    test('handles disabled state', () => {
        render(<ButtonAdapter isDisabled>Disabled Button</ButtonAdapter>);
        expect(screen.getByText('Disabled Button')).toBeDisabled();
    });

    test('handles loading state', () => {
        render(<ButtonAdapter isLoading>Loading Button</ButtonAdapter>);
        expect(screen.getByText('Loading Button')).toHaveAttribute('data-loading', 'true');
    });
});
