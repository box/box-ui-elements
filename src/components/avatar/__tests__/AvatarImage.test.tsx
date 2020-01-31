import React from 'react';
import { shallow } from 'enzyme';

import AvatarImage from '../AvatarImage';

const testDataURI = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

describe('components/avatar/AvatarImage', () => {
    test('should render an img element', () => {
        const wrapper = shallow(<AvatarImage className="test" url={testDataURI} />);
        expect(wrapper.is('img.avatar-image.test')).toBeTruthy();
        expect(wrapper.prop('src')).toEqual(testDataURI);
    });
});
