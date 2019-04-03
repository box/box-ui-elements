import React from 'react';
import { mount, render } from 'enzyme';
import { MemoryRouter, Router } from 'react-router-dom';
import NavButton from '..';

describe('elements/common/nav-button/NavButton', () => {
    describe('when active', () => {
        it('applies its default activeClassName', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity']}>
                    <NavButton to="/activity">Activity</NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(true);
        });

        it('applies a custom activeClassName instead of the default', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity']}>
                    <NavButton to="/activity" activeClassName="bdl-is-selected">
                        Activity
                    </NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(false);
            expect(button.hasClass('bdl-is-selected')).toBe(true);
        });
    });

    describe('when inactive', () => {
        it('does not apply its default activeClassName', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity']}>
                    <NavButton to="/details">Details</NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(false);
        });

        it('does not apply its activeClassName', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity']}>
                    <NavButton to="/details" activeClassName="bdl-is-selected">
                        Details
                    </NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(false);
            expect(button.hasClass('bdl-is-selected')).toBe(false);
        });
    });

    describe('exact', () => {
        it('does not do exact matching by default', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity/versions']}>
                    <NavButton to="/activity">Activity</NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(true);
        });

        it('applies default activeClassName for exact matches', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity']}>
                    <NavButton exact to="/activity">
                        Activity
                    </NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(true);
        });

        it('does not apply default activeClassName for partial matches', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity/versions']}>
                    <NavButton exact to="/activity">
                        Activity
                    </NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(false);
        });

        it('applies custom activeClassName for exact matches', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity']}>
                    <NavButton exact to="/activity" activeClassName="bdl-is-selected">
                        Activity
                    </NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-selected')).toBe(true);
        });

        it('applies custom activeClassName for partial matches', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity/versions']}>
                    <NavButton exact to="/activity" activeClassName="bdl-is-selected">
                        Activity
                    </NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-selected')).toBe(false);
        });
    });

    describe('strict', () => {
        it('does not do strict matching by default', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity']}>
                    <NavButton to="/activity/">Activity</NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(true);
        });

        it('applies default activeClassName for strict matches', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity/']}>
                    <NavButton strict to="/activity/">
                        Activity
                    </NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(true);
        });

        it('does not apply default activeClassName for non-strict matches', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity']}>
                    <NavButton strict to="/activity/">
                        Activity
                    </NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-active')).toBe(false);
        });

        it('applies custom activeClassName for strict matches', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity/']}>
                    <NavButton strict to="/activity/" activeClassName="bdl-is-selected">
                        Activity
                    </NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-selected')).toBe(true);
        });

        it('does not apply custom activeClassName for non-strict matches', () => {
            const button = render(
                <MemoryRouter initialEntries={['/activity']}>
                    <NavButton strict to="/activity/" activeClassName="bdl-is-selected">
                        Activity
                    </NavButton>
                </MemoryRouter>,
            );

            expect(button.hasClass('bdl-is-selected')).toBe(false);
        });
    });

    describe('onClick', () => {
        const mockHistory = {
            listen: jest.fn(),
            location: {},
            push: jest.fn(),
        };

        it('calls onClick eventhandler and history.push', () => {
            const clickHandler = jest.fn();

            const button = mount(
                <Router history={mockHistory}>
                    <NavButton to="/activity/test" onClick={clickHandler}>
                        Activity Test
                    </NavButton>
                </Router>,
            );

            button.simulate('click', {
                button: 0,
            });

            expect(clickHandler).toBeCalledTimes(1);
            expect(mockHistory.push).toBeCalledTimes(1);
            expect(mockHistory.push).toBeCalledWith('/activity/test');
        });

        it('does not call history.push on right click', () => {
            const button = mount(
                <Router history={mockHistory}>
                    <NavButton to="/activity/test">Activity Test</NavButton>
                </Router>,
            );

            button.simulate('click', {
                button: 1,
            });

            expect(mockHistory.push).toBeCalledTimes(0);
        });

        it('does not call history.push on prevented event', () => {
            const button = mount(
                <Router history={mockHistory}>
                    <NavButton to="/activity/test">Activity Test</NavButton>
                </Router>,
            );

            button.simulate('click', {
                defaultPrevented: true,
                button: 0,
            });

            expect(mockHistory.push).toBeCalledTimes(0);
        });
    });
});
