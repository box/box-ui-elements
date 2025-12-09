import * as React from 'react';
import { screen, fireEvent } from '@testing-library/react';

import { render } from '../../../test-utils/testing-library';
import SidebarToggleButton from '..';

describe('components/sidebar-toggle-button/SidebarToggleButton', () => {
    test.each([true, false])(
        'should render correctly as open if isPreviewModernizationEnabled is %s',
        isPreviewModernizationEnabled => {
            render(<SidebarToggleButton isOpen={false} />, {
                wrapperProps: { features: { previewModernization: { enabled: isPreviewModernizationEnabled } } },
            });

            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('bdl-SidebarToggleButton');
        },
    );

    test.each([true, false])(
        'should render correctly as left oriented toggle when open if isPreviewModernizationEnabled is %s',
        isPreviewModernizationEnabled => {
            render(<SidebarToggleButton direction="left" isOpen />, {
                wrapperProps: { features: { previewModernization: { enabled: isPreviewModernizationEnabled } } },
            });

            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('bdl-SidebarToggleButton');
        },
    );

    test.each([true, false])(
        'should render correctly as left oriented toggle when closed if isPreviewModernizationEnabled is %s',
        isPreviewModernizationEnabled => {
            render(<SidebarToggleButton direction="left" isOpen={false} />, {
                wrapperProps: { features: { previewModernization: { enabled: isPreviewModernizationEnabled } } },
            });

            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('bdl-SidebarToggleButton');
        },
    );

    test.each([true, false])(
        'should stop the mousedown event from being propogated up to box-annnotations if isPreviewModernizationEnabled is %s',
        isPreviewModernizationEnabled => {
            const onMouseDown = jest.fn();
            render(
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div onMouseDown={onMouseDown}>
                    <SidebarToggleButton isOpen />
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
        'should show proper button isPreviewModernizationEnabled is %s',
        isPreviewModernizationEnabled => {
            render(<SidebarToggleButton isOpen />, {
                wrapperProps: { features: { previewModernization: { enabled: isPreviewModernizationEnabled } } },
            });
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bdl-SidebarToggleButton');
            if (isPreviewModernizationEnabled) {
                expect(button).toHaveClass('bdl-SidebarToggleButton--modernized');
            } else {
                expect(button).not.toHaveClass('bdl-SidebarToggleButton--modernized');
            }
        },
    );
});
