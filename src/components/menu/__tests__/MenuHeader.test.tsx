import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import MenuContext from '../MenuContext';
import MenuHeader from '../MenuHeader';

describe('components/menu/MenuHeader', () => {
    describe('render()', () => {
        test('should render correctly with custom className', () => {
            const classNameCustom = 'oh-class';
            const classNameChild = 'child-class';
            const { container } = render(
                <MenuHeader title={<div className={classNameChild} />} className={classNameCustom} />,
            );

            expect(container.firstChild).toHaveClass('bdl-MenuHeader');
            expect(screen.queryByTestId('bdl-CloseButton')).toBeInTheDocument();
            expect(container.querySelector(`.${classNameCustom}`)).toBeInTheDocument();
            expect(container.querySelector(`.${classNameChild}`)).toBeInTheDocument();
        });
    });

    describe('closeMenu()', () => {
        test('should call closeMenu() from context when CloseButton clicked', () => {
            const closeMenu = jest.fn();
            render(
                <MenuContext.Provider value={{ closeMenu }}>
                    <MenuHeader />
                </MenuContext.Provider>,
            );

            fireEvent.click(screen.getByRole('button'));
            expect(closeMenu).toHaveBeenCalledTimes(1);
        });
    });
});
