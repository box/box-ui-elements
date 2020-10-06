import * as React from 'react';
import { shallow } from 'enzyme';

import BottomContentWrapper from '../BottomContentWrapper';

const getWrapper = () =>
    shallow(
        <BottomContentWrapper>
            <div>foo</div>
        </BottomContentWrapper>,
    );

describe('components/message-center/components/templates/common/BottomContentWrapper', () => {
    test('should render correctly', () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
