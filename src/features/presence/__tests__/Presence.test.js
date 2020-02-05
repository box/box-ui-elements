/* eslint-disable no-underscore-dangle */
import React from 'react';
import { createIntl } from 'react-intl';
import { PresenceComponent as Presence } from '../Presence';
import PresenceAvatar from '../PresenceAvatar';

const GlobalDate = Date;

const intl = createIntl({});

const collaboratorList = [
    {
        avatarUrl: '',
        id: '1',
        isActive: false,
        interactedAt: 999,
        interactionType: 'user.item_preview',
        name: 'e',
    },
    {
        avatarUrl: '',
        id: '2',
        isActive: false,
        interactedAt: 999,
        interactionType: 'user.item_upload',
        name: 'd',
    },
    {
        avatarUrl: '',
        id: '3',
        isActive: false,
        interactedAt: 999,
        interactionType: 'user.comment_create',
        name: 'c',
    },
    {
        avatarUrl: '',
        id: '4',
        isActive: false,
        interactedAt: 999,
        interactionType: 'user.item_preview',
        name: 'b',
    },
    {
        avatarUrl: '',
        id: '5',
        isActive: false,
        interactedAt: 999,
        interactionType: 'user.item_upload',
        name: 'a',
    },
];

describe('features/presence/Presence', () => {
    beforeEach(() => {
        global.Date = jest.fn(date => new GlobalDate(date));
        global.Date.now = () => 1000;
    });

    afterEach(() => {
        global.Date = GlobalDate;
    });
    describe('render()', () => {
        test('should correctly render empty state', () => {
            const collaborators = [];

            const wrapper = shallow(<Presence intl={intl} collaborators={collaborators} />);

            expect(wrapper.find('.presence-avatar-container').length).toBe(1);
            expect(wrapper.find('PresenceAvatar').length).toBe(0);
            expect(wrapper.find('.presence-count').length).toBe(0);
        });

        test('should correctly render collaborators without additional count when number of collaborators is less than or equal to maxDisplayedAvatars', () => {
            const maxDisplayedAvatars = 3;
            const wrapper = shallow(
                <Presence
                    intl={intl}
                    collaborators={collaboratorList.slice(0, maxDisplayedAvatars)}
                    maxDisplayedAvatars={maxDisplayedAvatars}
                />,
            );

            expect(wrapper.find('.presence-avatar-container').length).toBe(1);
            expect(wrapper.find('PresenceAvatar').length).toBe(maxDisplayedAvatars);
            expect(wrapper.find('.presence-count').length).toBe(0);
        });

        test('should correctly render collaborators with additional count when number of collaborators is greater than maxDisplayedAvatars', () => {
            const maxDisplayedAvatars = 3;
            const wrapper = shallow(
                <Presence intl={intl} collaborators={collaboratorList} maxDisplayedAvatars={maxDisplayedAvatars} />,
            );

            expect(wrapper.find('.presence-avatar-container').length).toBe(1);
            expect(wrapper.find('PresenceAvatar').length).toBe(maxDisplayedAvatars);
            expect(wrapper.find('.presence-count').length).toBe(1);
        });

        test('should set isDropdownActive to true and call OnFlyoutOpen when _handleOverlayOpen is called', () => {
            const onFlyoutOpenSpy = jest.fn();
            const wrapper = shallow(
                <Presence intl={intl} collaborators={collaboratorList} onFlyoutOpen={onFlyoutOpenSpy} />,
            );

            const instance = wrapper.instance();
            instance._handleOverlayOpen();

            expect(wrapper.state('isDropdownActive')).toBe(true);
            expect(onFlyoutOpenSpy).toHaveBeenCalled();
        });

        test('should set isDropdownActive to false and call OnFlyoutOpen and OnflyoutClose when _handleOverlayClose is called after _handleOverlayOpen', () => {
            const onFlyoutOpenSpy = jest.fn();
            const onFlyoutCloseSpy = jest.fn();
            const wrapper = shallow(
                <Presence
                    intl={intl}
                    collaborators={collaboratorList}
                    onFlyoutClose={onFlyoutCloseSpy}
                    onFlyoutOpen={onFlyoutOpenSpy}
                />,
            );

            const instance = wrapper.instance();
            instance._handleOverlayOpen();
            instance._handleOverlayClose();

            expect(wrapper.state('isDropdownActive')).toBe(false);
            expect(onFlyoutOpenSpy).toHaveBeenCalled();
            expect(onFlyoutCloseSpy).toHaveBeenCalled();
        });

        test('should set activeTooltip to the correct id and call onAvatarMouseEnter when _showTooltip is called', () => {
            const onAvatarMouseEnter = jest.fn();
            const wrapper = shallow(
                <Presence intl={intl} collaborators={collaboratorList} onAvatarMouseEnter={onAvatarMouseEnter} />,
            );

            const instance = wrapper.instance();
            instance._showTooltip('1');

            expect(wrapper.state('activeTooltip')).toEqual('1');
            expect(onAvatarMouseEnter).toHaveBeenCalled();
        });

        test('should set activeTooltip to null and call onAvatarMouseLeave when _hideTooltip is called', () => {
            const onAvatarMouseLeave = jest.fn();
            const wrapper = shallow(
                <Presence intl={intl} collaborators={collaboratorList} onAvatarMouseLeave={onAvatarMouseLeave} />,
            );

            const instance = wrapper.instance();
            instance._showTooltip('1');
            instance._hideTooltip();

            expect(wrapper.state('activeTooltip')).toEqual(null);
            expect(onAvatarMouseLeave).toHaveBeenCalled();
        });

        test('should pass through additional attributes when specified', () => {
            const avatarAttr = { 'data-resin-target': 'avatar' };
            const containerAttr = { 'data-resin-feature': 'presence' };
            const wrapper = shallow(
                <Presence
                    intl={intl}
                    avatarAttributes={avatarAttr}
                    collaborators={collaboratorList}
                    containerAttributes={containerAttr}
                />,
            );

            expect(wrapper.find('.presence-avatar-container').prop('data-resin-feature')).toEqual('presence');
            expect(
                wrapper
                    .find(PresenceAvatar)
                    .first()
                    .prop('data-resin-target'),
            ).toEqual('avatar');
        });

        test('should correctly render collaborators with additional count when number of collaborators is greater than maxAddionalCollaboratorsNum + maxDisplayedAvatars', () => {
            const maxDisplayedAvatars = 2;
            const maxAdditionalCollaboratorsNum = 1;
            const wrapper = shallow(
                <Presence
                    intl={intl}
                    collaborators={collaboratorList}
                    maxAdditionalCollaboratorsNum={maxAdditionalCollaboratorsNum}
                    maxDisplayedAvatars={maxDisplayedAvatars}
                />,
            );

            expect(wrapper.find('.presence-avatar-container').length).toBe(1);
            expect(wrapper.find('PresenceAvatar').length).toBe(maxDisplayedAvatars);
            expect(wrapper.find('.presence-count').length).toBe(1);
            expect(wrapper.find('.presence-count').text()).toBe('1+');
        });

        test('should correctly render collaborators with additional count when number of collaborators is less than maxAddionalCollaboratorsNum + maxDisplayedAvatars', () => {
            const maxDisplayedAvatars = 2;
            const maxAdditionalCollaboratorsNum = 10;
            const wrapper = shallow(
                <Presence
                    intl={intl}
                    collaborators={collaboratorList}
                    maxAdditionalCollaboratorsNum={maxAdditionalCollaboratorsNum}
                    maxDisplayedAvatars={maxDisplayedAvatars}
                />,
            );

            expect(wrapper.find('.presence-avatar-container').length).toBe(1);
            expect(wrapper.find('PresenceAvatar').length).toBe(maxDisplayedAvatars);
            expect(wrapper.find('.presence-count').length).toBe(1);
            expect(wrapper.find('.presence-count').text()).toBe('+3');
        });

        // GROWTH-382
        describe('Tests for presence autofly - GROWTH-382 AB test', () => {
            test('should render autofly on load when the experiment bucket is "flyout"', () => {
                const wrapper = shallow(
                    <Presence
                        intl={intl}
                        collaborators={collaboratorList}
                        experimentBucket="flyout"
                        onClickViewCollaborators={jest.fn()}
                    />,
                );
                expect(wrapper).toMatchSnapshot();
                expect(wrapper.find('.presence-autofly-first-load').length).toBe(1);
            });

            test('should not render autofly on load when the experiment bucket is "control" or null', () => {
                [
                    {
                        bucketName: 'control',
                    },
                    {
                        bucketName: null,
                    },
                ].forEach(({ bucketName }) => {
                    const wrapper = shallow(
                        <Presence
                            intl={intl}
                            collaborators={collaboratorList}
                            experimentBucket={bucketName}
                            onClickViewCollaborators={jest.fn()}
                        />,
                    );
                    expect(wrapper).toMatchSnapshot();
                    expect(wrapper.find('.presence-autofly-first-load').length).toBe(0);
                });
            });

            test('should not render autofly treatment when there are no collaborators to list', () => {
                const noCollaborators = [];
                const wrapper = shallow(
                    <Presence
                        intl={intl}
                        collaborators={noCollaborators}
                        experimentBucket="flyout"
                        onClickViewCollaborators={jest.fn()}
                    />,
                );
                expect(wrapper).toMatchSnapshot();
                expect(wrapper.find('.presence-autofly-first-load').length).toBe(0);
            });

            test('should not render autofly treatment when there is no click handler to open the recents panel', () => {
                const wrapper = shallow(
                    <Presence intl={intl} collaborators={collaboratorList} experimentBucket="flyout" />,
                );
                expect(wrapper).toMatchSnapshot();
                expect(wrapper.find('.presence-autofly-first-load').length).toBe(0);
            });

            test('_showRecentsFlyout performs correct actions', () => {
                const mockOnClickViewCollaborators = jest.fn();
                const mockEvent = {
                    preventDefault: () => {},
                    stopPropagation: () => {},
                };
                const wrapper = shallow(
                    <Presence
                        intl={intl}
                        collaborators={collaboratorList}
                        experimentBucket="flyout"
                        onClickViewCollaborators={mockOnClickViewCollaborators}
                    />,
                );

                wrapper.instance()._showRecentsFlyout(mockEvent);
                expect(mockOnClickViewCollaborators.mock.calls.length).toBe(1);
                expect(wrapper.state('showActivityPrompt')).toBe(false);
            });

            test('should show the Presence dropdown when state.showActivityPrompt is false', () => {
                const wrapper = shallow(
                    <Presence
                        intl={intl}
                        collaborators={collaboratorList}
                        experimentBucket="flyout"
                        onClickViewCollaborators={jest.fn()}
                    />,
                );
                expect(wrapper.find('.presence-dropdown').length).toBe(0);
                wrapper.setState({ showActivityPrompt: false }).update();
                expect(wrapper.find('.presence-dropdown').length).toBe(1);
                expect(wrapper.find('.presence-dropdown-request-stats').length).toBe(1);
            });

            test('calls callback to open access stats when that link is clicked', () => {
                const mockRequestAccessStats = jest.fn();
                const wrapper = shallow(
                    <Presence
                        intl={intl}
                        collaborators={collaboratorList}
                        experimentBucket="flyout"
                        onAccessStatsRequested={mockRequestAccessStats}
                        onClickViewCollaborators={jest.fn()}
                    />,
                );
                wrapper.setState({ showActivityPrompt: false }).update();

                wrapper.find('.presence-dropdown-request-stats').simulate('click');

                expect(mockRequestAccessStats.mock.calls.length).toBe(1);
            });
        });
        // end GROWTH-382
    });

    describe('_renderTimestampMessage()', () => {
        test('should return null when interactionType is an unkown type', () => {
            const wrapper = shallow(<Presence intl={intl} collaborators={collaboratorList} />);

            const instance = wrapper.instance();
            const res = instance._renderTimestampMessage(123, 'test1234');
            expect(res).toEqual(null);
        });

        test('should not return null when interactionType is a known type', () => {
            const wrapper = shallow(<Presence intl={intl} collaborators={collaboratorList} />);

            const instance = wrapper.instance();
            const res = instance._renderTimestampMessage(123, 'user.item_preview');
            expect(res).not.toEqual(null);
        });
    });
});
