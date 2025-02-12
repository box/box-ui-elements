import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import RadarButton from '../RadarButton';
import { ButtonType } from '../../button/Button';

const defaultProps = {
    children: 'Test Button',
    type: ButtonType.BUTTON,
};

jest.mock('../../radar', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="radar-animation">{children}</div>,
}));

describe('components/radar-button/RadarButton', () => {
    test('renders button without radar animation by default', () => {
        render(<RadarButton {...defaultProps} />);
        expect(screen.getByText('Test Button')).toBeInTheDocument();
        expect(screen.queryByTestId('radar-animation')).not.toBeInTheDocument();
    });

    test('renders button with radar animation when showRadar is true', () => {
        render(<RadarButton {...defaultProps} showRadar />);
        expect(screen.getByText('Test Button')).toBeInTheDocument();
        expect(screen.getByTestId('radar-animation')).toBeInTheDocument();
    });

    test('forwards ref to button element', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<RadarButton {...defaultProps} ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
});
