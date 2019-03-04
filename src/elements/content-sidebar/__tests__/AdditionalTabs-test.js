import React from 'react';
import { shallow } from 'enzyme';
import AdditionalTabs from '../AdditionalTabs';
import AdditionalTab from '../AdditionalTab';

describe('elements/content-sidebar/AdditionalTabs', () => {
    const getWrapper = props => shallow(<AdditionalTabs {...props} />);

    test('should render the correct number of tabs', () => {
        const props = {
            tabs: [
                {
                    id: 200,
                    title: 'Test title',
                    iconUrl: 'https://foo.com/icon',
                    callback: jest.fn(),
                    status: 'ADDED',
                },
                {
                    id: 1,
                    title: 'Another title',
                    iconUrl: 'https://foo.com/icon',
                    callback: jest.fn(),
                    status: 'ADDED',
                },
            ],
        };

        const wrapper = getWrapper(props);
        expect(wrapper.find(AdditionalTab)).toHaveLength(2);
        expect(wrapper).toMatchSnapshot();
    });
});
