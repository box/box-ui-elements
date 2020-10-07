import * as React from 'react';
import { shallow } from 'enzyme';

import MessageFormattedDate from '../MessageFormattedDate';

const defaultProps = {
    date: new Date(1600297599505),
};

const getWrapper = props => shallow(<MessageFormattedDate {...defaultProps} {...props} />);

describe('components/message-center/components/templates/common/MessageFormattedDate', () => {
    test('should render date short month short date, year', () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
