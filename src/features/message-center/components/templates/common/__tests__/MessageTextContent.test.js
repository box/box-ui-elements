import * as React from 'react';
import { shallow } from 'enzyme';

import MessageTextContent from '../MessageTextContent';

const defaultProps = {
    title: 'This is a test title',
};

const getWrapper = props => shallow(<MessageTextContent {...defaultProps} {...props} />);

describe('components/message-center/components/templates/common/MessageTextContent', () => {
    test('should render correctly without body prop', () => {
        expect(getWrapper()).toMatchSnapshot();
    });

    test('should render correctly with body prop', () => {
        expect(getWrapper({ body: '<em>test</em>' })).toMatchSnapshot();
    });
});
