import React from 'react';
import { createIntl } from 'react-intl';
import { shallow, ShallowWrapper } from 'enzyme';
import collaboratorList from '../__mocks__/collaborators';
// @ts-ignore flow import
import messages from '../messages';
import { PresenceAvatarTooltipComponent as PresenceAvatarTooltip } from '../PresenceAvatarTooltip';

const GlobalDate = Date;

const intl = createIntl({ locale: 'en' });

describe('features/presence/PresenceAvatarTooltip', () => {
    const collaborator = collaboratorList[0];
    const getDefaults = () => ({ intl, ...collaborator });

    const getWrapper = (props = {}): ShallowWrapper => shallow(<PresenceAvatarTooltip {...getDefaults()} {...props} />);

    beforeEach(() => {
        // @ts-ignore Simple Date constructor
        global.Date = jest.fn(date => new GlobalDate(date));
        global.Date.now = () => 1000;
    });

    afterEach(() => {
        global.Date = GlobalDate;
    });

    describe('render()', () => {
        test('should render the name if interaction type is not preview', () => {
            const wrapper = getWrapper({ ...collaborator, interactionType: 'foo' });

            expect(wrapper.find('.bdl-PresenceAvatarTooltip-name').text()).toBe('e');
            expect(wrapper.exists('.bdl-PresenceAvatarTooltip-event')).toBe(false);
        });

        test('should render the active now message if collaborator is active', () => {
            const wrapper = getWrapper({ ...collaborator, isActive: true });

            expect(wrapper.find('FormattedMessage').props()).toEqual(messages.activeNowText);
        });

        test('should render the last action message if collaborator is not active', () => {
            const wrapper = getWrapper({ ...collaborator, isActive: false });

            expect(wrapper.find('FormattedMessage').props()).toMatchObject({
                ...messages.timeSinceLastPreviewedText,
                values: { timeAgo: '1 second ago' },
            });
        });
    });
});
