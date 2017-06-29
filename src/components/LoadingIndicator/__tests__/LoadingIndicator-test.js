import React from 'react';
import { shallow } from 'enzyme';
import LoadingIndicator from '../';

describe('LoadingIndicator/LoadingIndicator', () => {
    it('should correctly render default loading indicator', () => {
        const wrapper = shallow(<LoadingIndicator />);

        assert.isTrue(wrapper.hasClass('buik-crawler'));
        assert.isTrue(wrapper.hasClass('buik-crawler-is-default'));
        assert.lengthOf(wrapper.children(), 3);
    });

    it('should correctly render small loading indicator', () => {
        const wrapper = shallow(<LoadingIndicator size='small' />);

        assert.isTrue(wrapper.hasClass('buik-crawler'));
        assert.isTrue(wrapper.hasClass('buik-crawler-is-small'));
    });

    it('should correctly render large loading indicator', () => {
        const wrapper = shallow(<LoadingIndicator size='large' />);

        assert.isTrue(wrapper.hasClass('buik-crawler'));
        assert.isTrue(wrapper.hasClass('buik-crawler-is-large'));
    });
});
