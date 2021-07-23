import React from 'react';
import { createIntl } from 'react-intl';
import collaboratorList from '../__mocks__/collaborators';
import { PresenceCollaboratorsListComponent as PresenceCollaboratorsList } from '../PresenceCollaboratorsList';

const intl = createIntl({});

describe('features/presence/PresenceCollaboratorsList', () => {
    describe('componentDidMount()', () => {
        [
            // isn't scrollable at all
            {
                isScrollableAbove: false,
                isScrollableBelow: false,
            },
            // can scroll above
            {
                isScrollableAbove: true,
                isScrollableBelow: false,
            },
            // can scroll below
            {
                isScrollableAbove: false,
                isScrollableBelow: true,
            },
            // can scroll both above and below
            {
                isScrollableAbove: true,
                isScrollableBelow: true,
            },
        ].forEach(({ isScrollableAbove, isScrollableBelow }) => {
            test('should calculate and set overflow state', () => {
                const wrapper = shallow(<PresenceCollaboratorsList collaborators={[]} />, {
                    disableLifecycleMethods: true,
                });
                const instance = wrapper.instance();
                const calculateOverflowSpy = jest.fn().mockReturnValue({
                    isScrollableBelow,
                    isScrollableAbove,
                });
                instance.calculateOverflow = calculateOverflowSpy;
                instance.componentDidMount();
                expect(calculateOverflowSpy).toHaveBeenCalledTimes(1);
                expect(wrapper.state().isScrollableAbove).toBe(isScrollableAbove);
                expect(wrapper.state().isScrollableBelow).toBe(isScrollableBelow);
            });
        });
    });

    describe('handleScroll()', () => {
        [
            // isn't scrollable at all
            {
                isScrollableAbove: false,
                isScrollableBelow: false,
            },
            // can scroll above
            {
                isScrollableAbove: true,
                isScrollableBelow: false,
            },
            // can scroll below
            {
                isScrollableAbove: false,
                isScrollableBelow: true,
            },
            // can scroll both above and below
            {
                isScrollableAbove: true,
                isScrollableBelow: true,
            },
        ].forEach(({ isScrollableAbove, isScrollableBelow }) => {
            test('should calculate, call onScroll and set overflow state', () => {
                const onScrollSpy = jest.fn();
                const wrapper = shallow(
                    <PresenceCollaboratorsList intl={intl} collaborators={collaboratorList} onScroll={onScrollSpy} />,
                    {
                        disableLifecycleMethods: true,
                    },
                );
                const instance = wrapper.instance();
                const calculateOverflowSpy = jest.fn().mockReturnValue({
                    isScrollableBelow,
                    isScrollableAbove,
                });
                instance.calculateOverflow = calculateOverflowSpy;
                instance.elDropdownList = true;
                instance.handleScroll();
                expect(wrapper.state().isScrollableAbove).toBe(isScrollableAbove);
                expect(wrapper.state().isScrollableBelow).toBe(isScrollableBelow);
                expect(onScrollSpy).toHaveBeenCalled();
            });
        });
    });

    describe('calculateOverflow', () => {
        [
            // not scrollable above or below
            {
                elem: { scrollTop: 0, scrollHeight: 0, clientHeight: 0 },
                isScrollableAbove: false,
                isScrollableBelow: false,
            },
            // only scrollable above
            {
                elem: { scrollTop: 20, scrollHeight: 80, clientHeight: 100 },
                isScrollableAbove: true,
                isScrollableBelow: false,
            },
            // only scrollable below
            {
                elem: { scrollTop: 0, scrollHeight: 100, clientHeight: 80 },
                isScrollableAbove: false,
                isScrollableBelow: true,
            },
            // scrollable above and below
            {
                elem: { scrollTop: 20, scrollHeight: 100, clientHeight: 70 },
                isScrollableAbove: true,
                isScrollableBelow: true,
            },
        ].forEach(({ elem, isScrollableAbove, isScrollableBelow }) => {
            test('should calculate overflow and return isScrollableAbove and isScrollableBelow', () => {
                const wrapper = shallow(<PresenceCollaboratorsList collaborators={[]} />, {
                    disableLifecycleMethods: true,
                });
                const instance = wrapper.instance();
                const result = instance.calculateOverflow(elem);
                expect(result.isScrollableAbove).toBe(isScrollableAbove);
                expect(result.isScrollableBelow).toBe(isScrollableBelow);
            });
        });
    });

    describe('renderTimestampMessage()', () => {
        test('should return null when interactionType is an unkown type', () => {
            const wrapper = shallow(<PresenceCollaboratorsList intl={intl} collaborators={collaboratorList} />, {
                disableLifecycleMethods: true,
            });
            const instance = wrapper.instance();
            const res = instance.renderTimestampMessage(123, 'test1234');
            expect(res).toEqual(null);
        });

        test('should not return null when interactionType is a known type', () => {
            const wrapper = shallow(<PresenceCollaboratorsList intl={intl} collaborators={collaboratorList} />, {
                disableLifecycleMethods: true,
            });
            const instance = wrapper.instance();
            const res = instance.renderTimestampMessage(123, 'user.item_preview');
            expect(res).not.toEqual(null);
        });
    });

    describe('render()', () => {
        test('should correctly render an empty PresenceCollaboratorsList', () => {
            const collaborators = [];

            const wrapper = shallow(<PresenceCollaboratorsList intl={intl} collaborators={collaborators} />, {
                disableLifecycleMethods: true,
            });

            const instance = wrapper.instance();

            const calculateOverflowSpy = jest.fn().mockReturnValue({
                isScrollableBelow: false,
                isScrollableAbove: false,
            });
            instance.calculateOverflow = calculateOverflowSpy;

            expect(wrapper.find('.bdl-PresenceCollaboratorsList-list').length).toBe(1);
            expect(wrapper.find('.bdl-PresenceCollaboratorsList-item').length).toBe(0);
            expect(wrapper.find('.bdl-PresenceCollaboratorsList-actions').length).toBe(0);
        });

        test('should correctly render collaborators', () => {
            const wrapper = shallow(<PresenceCollaboratorsList intl={intl} collaborators={collaboratorList} />, {
                disableLifecycleMethods: true,
            });

            expect(wrapper.find('.bdl-PresenceCollaboratorsList-list').length).toBe(1);
            expect(wrapper.find('.bdl-PresenceCollaboratorsList-item').length).toBe(5);
        });

        test('should correctly render dropdownActions', () => {
            const wrapper = shallow(
                <PresenceCollaboratorsList
                    intl={intl}
                    collaborators={collaboratorList}
                    getLinkCallback={() => {}}
                    inviteCallback={() => {}}
                />,
                { disableLifecycleMethods: true },
            );

            expect(wrapper.find('.bdl-PresenceCollaboratorsList-actions').length).toBe(1);
        });
    });
});
