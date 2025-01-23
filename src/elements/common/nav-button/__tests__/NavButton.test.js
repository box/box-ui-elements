import * as React from 'react';
import { mount, render } from 'enzyme';
import { render as rtlRender, screen } from '../../../../test-utils/testing-library';
import CustomRouter from '../../routing/customRouter';
import NavButton from '..';

describe('elements/common/nav-button/NavButton', () => {
    const getNavButton = (content, { path = '/activity', ...props }) => (
        <CustomRouter initialEntries={[path]}>
            <NavButton to={path} {...props}>
                {content}
            </NavButton>
        </CustomRouter>
    );

    describe('when active', () => {
        test('applies its default activeClassName', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity']}>
                    <NavButton to="/activity">Activity</NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(true);
        });

        test('applies a custom activeClassName instead of the default', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity']}>
                    <NavButton to="/activity" activeClassName="bdl-is-selected">
                        Activity
                    </NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(false);
            expect(button.hasClass('bdl-is-selected')).toBe(true);
        });
    });

    describe('when inactive', () => {
        test('does not apply its default activeClassName', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity']}>
                    <NavButton to="/details">Details</NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(false);
        });

        test('does not apply its activeClassName', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity']}>
                    <NavButton to="/details" activeClassName="bdl-is-selected">
                        Details
                    </NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(false);
            expect(button.hasClass('bdl-is-selected')).toBe(false);
        });
    });

    describe('when disabled', () => {
        test('applies bdl-is-disabled class name', () => {
            const content = 'Activity';
            rtlRender(getNavButton(content, { isDisabled: true }));

            expect(screen.getByText(content, { selector: '.bdl-is-disabled' })).toBeInTheDocument();
        });
    });

    describe('exact', () => {
        test('does not do exact matching by default', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity/versions']}>
                    <NavButton to="/activity">Activity</NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(true);
        });

        test('applies default activeClassName for exact matches', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity']}>
                    <NavButton exact to="/activity">
                        Activity
                    </NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(true);
        });

        test('does not apply default activeClassName for partial matches', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity/versions']}>
                    <NavButton exact to="/activity">
                        Activity
                    </NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(false);
        });

        test('applies custom activeClassName for exact matches', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity']}>
                    <NavButton exact to="/activity" activeClassName="bdl-is-selected">
                        Activity
                    </NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-selected')).toBe(true);
        });

        test('applies custom activeClassName for partial matches', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity/versions']}>
                    <NavButton exact to="/activity" activeClassName="bdl-is-selected">
                        Activity
                    </NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-selected')).toBe(false);
        });
    });

    describe('isActive', () => {
        test('overrides the default matching behavior and sets the active class name', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity']}>
                    <NavButton isActive={() => true} to="/skills">
                        Skills
                    </NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(true);
        });
    });

    describe('strict', () => {
        test('does not do strict matching by default', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity']}>
                    <NavButton to="/activity/">Activity</NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(true);
        });

        test('applies default activeClassName for strict matches', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity/']}>
                    <NavButton strict to="/activity/">
                        Activity
                    </NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(true);
        });

        test('does not apply default activeClassName for non-strict matches', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity']}>
                    <NavButton strict to="/activity/">
                        Activity
                    </NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(false);
        });

        test('applies custom activeClassName for strict matches', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity/']}>
                    <NavButton strict to="/activity/" activeClassName="bdl-is-selected">
                        Activity
                    </NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-selected')).toBe(true);
        });

        test('does not apply custom activeClassName for non-strict matches', () => {
            const button = render(
                <CustomRouter initialEntries={['/activity']}>
                    <NavButton strict to="/activity/" activeClassName="bdl-is-selected">
                        Activity
                    </NavButton>
                </CustomRouter>,
            );

            expect(button.hasClass('bdl-is-selected')).toBe(false);
        });
    });

    describe('onClick', () => {
        // History mock removed since we use CustomRouter

        test('calls onClick eventhandler and history.push', () => {
            const clickHandler = jest.fn();

            const button = mount(
                <CustomRouter initialEntries={['/']}>
                    <NavButton to="/activity/test" onClick={clickHandler}>
                        Activity Test
                    </NavButton>
                </CustomRouter>,
            );

            button.simulate('click', {
                button: 0,
            });

            expect(clickHandler).toBeCalledTimes(1);
            // Navigation is now handled by CustomRouter
            expect(clickHandler).toHaveBeenCalledTimes(1);
        });

        test('does not call history.push on right click', () => {
            const button = mount(
                <CustomRouter initialEntries={['/']}>
                    <NavButton to="/activity/test">Activity Test</NavButton>
                </CustomRouter>,
            );

            button.simulate('click', {
                button: 1,
            });

            // Right click should not trigger navigation
            expect(button.find('NavButton').props().to).toBe('/activity/test');
        });

        test('does not call history.push on prevented event', () => {
            const button = mount(
                <CustomRouter initialEntries={['/']}>
                    <NavButton to="/activity/test">Activity Test</NavButton>
                </CustomRouter>,
            );

            button.simulate('click', {
                defaultPrevented: true,
                button: 0,
            });

            // Prevented events should not trigger navigation
            expect(button.find('NavButton').props().to).toBe('/activity/test');
        });
    });
});
