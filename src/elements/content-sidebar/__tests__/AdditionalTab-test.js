import React from 'react';
import { shallow } from 'enzyme';
import Tooltip from '../../common/Tooltip';
import PlainButton from '../../../components/plain-button/PlainButton';
import AdditionalTab from '../AdditionalTab';

describe('elements/content-sidebar/AdditionalTab', () => {
    const getWrapper = props => shallow(<AdditionalTab {...props} />);

    test('should render the tooltip and button contents', () => {
        const testContent = 'test content';
        const TestComponent = <div>{testContent}</div>;
        const props = {
            title: 'test title',
            element: TestComponent,
            id: 4,
            callback: () => {},
        };

        const wrapper = getWrapper(props);

        expect(
            wrapper
                .find(PlainButton)
                .childAt(0)
                .text(),
        ).toEqual(testContent);
        expect(wrapper.find(Tooltip).prop('text')).toBe('test title');

        expect(wrapper).toMatchSnapshot();
    });
});
