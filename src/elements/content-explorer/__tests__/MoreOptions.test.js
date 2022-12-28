import React from 'react';
import Menu from '../../../components/menu/Menu';
import MoreOptions from '../MoreOptions';

const intlMock = {
    formatMessage: jest.fn().mockReturnValue('More options'),
};

describe('elements/content-explorer/MoreOptions', () => {
    const defaultProps = {
        item: { permissions: {} },
    };
    const getWrapper = props => mount(<MoreOptions intl={intlMock} {...defaultProps} {...props} />);

    test('should have aria-label for the `More options` button', () => {
        const props = {
            canDelete: true,
            item: { permissions: { can_delete: true } },
        };
        const wrapper = getWrapper(props);
        const moreOptionsButton = wrapper.find('.bce-btn-more-options');
        expect(moreOptionsButton.at(0).prop('aria-label')).toBe('More options');
    });

    test('should not show `Menu` with no actions allowed', () => {
        const wrapper = getWrapper();
        const menu = wrapper.find(Menu);
        expect(menu.exists()).toBe(false);
    });
});
