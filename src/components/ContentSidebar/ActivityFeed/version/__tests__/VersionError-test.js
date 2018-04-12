import React from 'react';
import { shallow } from 'enzyme';

import VersionError from '../VersionError';

describe('components/ContentSidebar/ActivityFeed/version/VersionError', () => {
    test('should correctly render error message', () => {
        const error = { errorCode: 'tooManyVersions' };

        const wrapper = shallow(<VersionError {...error} />);

        expect(wrapper).toMatchSnapshot();
    });
});
