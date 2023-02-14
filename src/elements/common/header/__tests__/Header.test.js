import React from 'react';
import { shallow } from 'enzyme';
import { HeaderBase as Header } from '../Header';

describe('elements/common/header/Header', () => {
    const intl = {
        formatMessage: jest.fn().mockImplementation(message => message.defaultMessage),
    };

    const getWrapper = props => shallow(<Header intl={intl} {...props} />);

    test('renders Logo component when isHeaderLogoVisible is passed', () => {
        const wrapper = getWrapper({ isHeaderLogoVisible: true });
        expect(wrapper.find('Logo').exists()).toBe(true);
    });

    test('renders matching values for aria-label and placeholder attributes', () => {
        const wrapper = getWrapper();
        const inputProps = wrapper.find('[data-testid="be-search-input"]').props();
        expect(inputProps['aria-label']).toBe(inputProps.placeholder);
    });

    test('disables search input when view is not `folder` and not `search`', () => {
        const wrapper = getWrapper({ view: 'recents' });
        expect(wrapper.find('[data-testid="be-search-input"]').prop('disabled')).toBe(true);
    });

    test.each(['folder', 'search'])('does not disable search input when view is %s', view => {
        const wrapper = getWrapper({ view });
        expect(wrapper.find('[data-testid="be-search-input"]').prop('disabled')).toBe(false);
    });
});
