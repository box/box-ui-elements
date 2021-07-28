import React from 'react';
import { createIntl } from 'react-intl';
import { shallow, ShallowWrapper } from 'enzyme';
import collaboratorList from '../__mocks__/collaborators';
// @ts-ignore flow import
import messages from '../messages';
import { PresenceAvatarTooltipContentComponent as PresenceAvatarTooltipContent } from '../PresenceAvatarTooltipContent';

const intl = createIntl({ locale: 'en' });

describe('features/presence/PresenceAvatarTooltipContent', () => {
    const collaborator = collaboratorList[0];
    const getDefaults = () => ({ intl, ...collaborator });

    const getWrapper = (props = {}): ShallowWrapper =>
        shallow(<PresenceAvatarTooltipContent {...getDefaults()} {...props} />);

    beforeEach(() => {
        jest.spyOn(Date, 'now').mockImplementation(() => 1000);
    });

    describe('render()', () => {
        test('should render the name if interaction type is not preview', () => {
            const wrapper = getWrapper({ ...collaborator, interactionType: 'foo' });

            expect(wrapper.find('.bdl-PresenceAvatarTooltipContent-name').text()).toBe('e');
            expect(wrapper.exists('.bdl-PresenceAvatarTooltipContent-event')).toBe(false);
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
