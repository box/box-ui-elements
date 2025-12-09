import * as React from 'react';
import { screen, fireEvent } from '@testing-library/react';

import { render } from '../../../test-utils/testing-library';
import SidebarToggleButton from '..';

describe('components/sidebar-toggle-button/SidebarToggleButton', () => {
    test.each`
        isOpen   | direction
        ${true}  | ${'left'}
        ${false} | ${'left'}
        ${true}  | ${'right'}
        ${false} | ${'right'}
    `(
        'should render correct button correctly when open is $isOpen and direction is $direction and isPreviewModernizationEnabled is false',
        ({ isOpen, direction }) => {
            render(<SidebarToggleButton isOpen={isOpen} direction={direction} />, {
                wrapperProps: { features: { previewModernization: { enabled: false } } },
            });

            const button = screen.getByRole('button');
            let iconClassName = '';
            let iconNotDisplayedClassName = '';
            if (direction === 'left') {
                iconClassName = isOpen ? 'icon-show' : 'icon-hide';
                iconNotDisplayedClassName = isOpen ? 'icon-hide' : 'icon-show';
            } else {
                iconClassName = isOpen ? 'icon-hide' : 'icon-show';
                iconNotDisplayedClassName = isOpen ? 'icon-show' : 'icon-hide';
            }
            const icon = button.querySelector(`.${iconClassName}`);
            const iconNotDisplayed = button.querySelector(`.${iconNotDisplayedClassName}`);
            expect(icon).toBeInTheDocument();
            expect(iconNotDisplayed).not.toBeInTheDocument();
            const isCollapsed = button.classList.contains('bdl-is-collapsed');
            expect(isCollapsed).toBe(!isOpen);
        },
    );

    test.each([true, false])(
        'should stop the mousedown event from being propogated up to box-annnotations if isPreviewModernizationEnabled is %s',
        isPreviewModernizationEnabled => {
            const onMouseDown = jest.fn();
            const onClick = jest.fn();
            render(
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div onMouseDown={onMouseDown}>
                    <SidebarToggleButton isOpen onClick={onClick} />
                </div>,
                {
                    wrapperProps: { features: { previewModernization: { enabled: isPreviewModernizationEnabled } } },
                },
            );
            const button = screen.getByRole('button');
            fireEvent.mouseDown(button);
            expect(onMouseDown).not.toHaveBeenCalled();
        },
    );

    test.each([true, false])(
        'should show proper button isPreviewModernizationEnabled is %s and click handler should work',
        isPreviewModernizationEnabled => {
            const onClick = jest.fn();
            render(<SidebarToggleButton isOpen onClick={onClick} />, {
                wrapperProps: { features: { previewModernization: { enabled: isPreviewModernizationEnabled } } },
            });
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bdl-SidebarToggleButton');
            const isModernized = button.classList.contains('bdl-SidebarToggleButton--modernized');
            expect(isModernized).toBe(isPreviewModernizationEnabled);
            fireEvent.click(button);
            expect(onClick).toHaveBeenCalled();
        },
    );
});
