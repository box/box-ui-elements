/* eslint-disable no-underscore-dangle */
import React from 'react';
import { createIntl } from 'react-intl';
import collaboratorList from '../__mocks__/collaborators';
import { PresenceComponent as Presence } from '../Presence';

const GlobalDate = Date;

const intl = createIntl({});

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
                expect(wrapper.find('PresenceCollaboratorsList').length).toBe(0);
                wrapper.setState({ showActivityPrompt: false }).update();
                expect(wrapper.find('PresenceCollaboratorsList').length).toBe(1);
                expect(wrapper.find('.presence-overlay-request-stats').length).toBe(1);
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

                wrapper.find('.presence-overlay-request-stats').simulate('click');

                expect(mockRequestAccessStats.mock.calls.length).toBe(1);
            });
        });
        // end GROWTH-382
    });
});
