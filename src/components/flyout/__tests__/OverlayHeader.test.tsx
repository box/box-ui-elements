import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import FlyoutContext from '../FlyoutContext';
import OverlayHeader from '../OverlayHeader';

describe('components/flyout/OverlayHeader', () => {
    describe('render()', () => {
        test('should render correctly with custom className', () => {
            const classNameCustom = 'oh-class';
            const classNameChild = 'child-class';
            const { container } = render(
                <OverlayHeader className={classNameCustom}>
                    <div className={classNameChild} />
                </OverlayHeader>,
            );

            expect(container.firstChild).toHaveClass('bdl-OverlayHeader');
            expect(screen.queryByTestId('bdl-CloseButton')).toBeInTheDocument();
            expect(container.querySelector(`.${classNameCustom}`)).toBeInTheDocument();
            expect(container.querySelector(`.${classNameChild}`)).toBeInTheDocument();
        });
    });

    describe('closeOverlay()', () => {
        test('should call closeOverlay() from context when CloseButton clicked', () => {
            const closeOverlay = jest.fn();
            render(
                <FlyoutContext.Provider value={{ closeOverlay }}>
                    <OverlayHeader>
                        <p>Hi</p>
                    </OverlayHeader>
                </FlyoutContext.Provider>,
            );

            fireEvent.click(screen.getByRole('button'));
            expect(closeOverlay).toHaveBeenCalledTimes(1);
        });
    });

    describe('handleClick()', () => {
        test('should prevent default and stop propagation when elements in handleClick called', () => {
            const overlayClick = jest.fn();
            render(
                <div role="presentation" onClick={overlayClick}>
                    <OverlayHeader>
                        <p>Hi</p>
                    </OverlayHeader>
                </div>,
            );

            fireEvent.click(screen.getByRole('button'));
            expect(overlayClick).toHaveBeenCalledTimes(0);
        });

        test.each([
            {
                isOverlayHeaderActionEnabled: false,
                expectedCallCount: 0,
                behavior: 'prevent default and stop propagation',
            },
            { isOverlayHeaderActionEnabled: true, expectedCallCount: 1, behavior: 'allow default and propagation' },
        ])(
            'should $behavior when isOverlayHeaderActionEnabled is $isOverlayHeaderActionEnabled',
            ({ isOverlayHeaderActionEnabled, expectedCallCount }) => {
                const overlayClick = jest.fn();

                render(
                    <div role="presentation" onClick={overlayClick}>
                        <OverlayHeader isOverlayHeaderActionEnabled={isOverlayHeaderActionEnabled}>
                            <p>Hi</p>
                        </OverlayHeader>
                    </div>,
                );

                fireEvent.click(screen.getByRole('button'));
                expect(overlayClick).toHaveBeenCalledTimes(expectedCallCount);
            },
        );
    });
});
