// @flow
import * as React from 'react';
import { shallow } from 'enzyme';

import EmptyState from '../EmptyState';

describe('components/message-center/components/message-center-modal/EmptyState', () => {
    function getWrapper() {
        return shallow(<EmptyState />);
    }

    test('should render correctly', async () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
