// @flow
import * as React from 'react';
import { shallow } from 'enzyme';

import ErrorState from '../ErrorState';

describe('components/message-center/components/error-state/ErrorState', () => {
    function getWrapper() {
        return shallow(<ErrorState />);
    }

    test('should render correctly', async () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
