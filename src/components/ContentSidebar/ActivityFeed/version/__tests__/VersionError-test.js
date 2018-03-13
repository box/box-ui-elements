import React from 'react';
import { shallow } from 'enzyme';

import VersionError from '../VersionError';

describe('features/activity-feed/version/VersionError', () => {
    test('should correctly render error message', () => {
        const error = { errorCode: 'tooManyVersions' };

        const wrapper = shallow(<VersionError {...error} />);
        const formattedMessage = wrapper.find('FormattedMessage');

        expect(wrapper.hasClass('box-ui-version')).toBe(true);
        expect(wrapper.hasClass('error')).toBe(true);
        expect(formattedMessage.prop('defaultMessage')).toEqual('Multiple versions of this file');
    });
});
