import React from 'react';
import { createIntl } from 'react-intl';
import { PresenceDropdownComponent as PresenceDropdown } from '../PresenceDropdown';

const collaboratorList = [
    // user item preview
    {
        avatarUrl: '',
        id: '1',
        isActive: false,
        interactedAt: 999,
        interactionType: 'user.item_preview',
        name: 'e',
    },
    // user item upload
    {
        avatarUrl: '',
        id: '2',
        isActive: false,
        interactedAt: 999,
        interactionType: 'user.item_upload',
        name: 'd',
    },
    // user comment create
    {
        avatarUrl: '',
        id: '3',
        isActive: false,
        interactedAt: 999,
        interactionType: 'user.comment_create',
        name: 'c',
    },
    // user item preview
    {
        avatarUrl: '',
        id: '4',
        isActive: false,
        interactedAt: 999,
        interactionType: 'user.item_preview',
        name: 'b',
    },
    // user item upload
    {
        avatarUrl: '',
        id: '5',
        isActive: false,
        interactedAt: 999,
        interactionType: 'user.item_upload',
        name: 'a',
        profileUrl: 'www.box.com',
    },
];

const intl = createIntl({});

describe('features/presence/PresenceDropdown', () => {
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
                const wrapper = shallow(<PresenceDropdown collaborators={[]} />, { disableLifecycleMethods: true });
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
                    <PresenceDropdown intl={intl} collaborators={collaboratorList} onScroll={onScrollSpy} />,
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
                const wrapper = shallow(<PresenceDropdown collaborators={[]} />, { disableLifecycleMethods: true });
                const instance = wrapper.instance();
                const result = instance.calculateOverflow(elem);
                expect(result.isScrollableAbove).toBe(isScrollableAbove);
                expect(result.isScrollableBelow).toBe(isScrollableBelow);
            });
        });
    });

    describe('renderTimestampMessage()', () => {
        test('should return null when interactionType is an unkown type', () => {
            const wrapper = shallow(<PresenceDropdown intl={intl} collaborators={collaboratorList} />, {
                disableLifecycleMethods: true,
            });
            const instance = wrapper.instance();
            const res = instance.renderTimestampMessage(123, 'test1234');
            expect(res).toEqual(null);
        });

        test('should not return null when interactionType is a known type', () => {
            const wrapper = shallow(<PresenceDropdown intl={intl} collaborators={collaboratorList} />, {
                disableLifecycleMethods: true,
            });
            const instance = wrapper.instance();
            const res = instance.renderTimestampMessage(123, 'user.item_preview');
            expect(res).not.toEqual(null);
        });
    });

    describe('render()', () => {
        test('should correctly render an empty PresenceDropdown', () => {
            const collaborators = [];

            const wrapper = shallow(<PresenceDropdown intl={intl} collaborators={collaborators} />, {
                disableLifecycleMethods: true,
            });

            const instance = wrapper.instance();

            const calculateOverflowSpy = jest.fn().mockReturnValue({
                isScrollableBelow: false,
                isScrollableAbove: false,
            });
            instance.calculateOverflow = calculateOverflowSpy;

            expect(wrapper.find('.presence-dropdown-list').length).toBe(1);
            expect(wrapper.find('.presence-dropdown-item').length).toBe(0);
            expect(wrapper.find('.presence-dropdown-actions').length).toBe(0);
        });

        test('should correctly render collaborators', () => {
            const wrapper = shallow(<PresenceDropdown intl={intl} collaborators={collaboratorList} />, {
                disableLifecycleMethods: true,
            });

            expect(wrapper.find('.presence-dropdown-list').length).toBe(1);
            expect(wrapper.find('.presence-dropdown-item').length).toBe(5);
        });

        test('should correctly render dropdownActions', () => {
            const wrapper = shallow(
                <PresenceDropdown
                    intl={intl}
                    collaborators={collaboratorList}
                    getLinkCallback={() => {}}
                    inviteCallback={() => {}}
                />,
                { disableLifecycleMethods: true },
            );

            expect(wrapper.find('.presence-dropdown-actions').length).toBe(1);
        });
    });
});
