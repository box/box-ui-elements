import React from 'react';
import { shallow } from 'enzyme';
import Internationalize from '../Internationalize';

const messages = {};

describe('elements/Internationalize', () => {
    test('should contains IntlProvider with correct props', () => {
        const wrapper = shallow(
            <Internationalize language="fr-CA" messages={messages}>
                <div className="content" />
            </Internationalize>,
        );

        const intlProvider = wrapper.find('IntlProvider');
        expect(intlProvider.length).toBe(1);
        expect(intlProvider.prop('locale')).toBe('fr-CA');
        expect(intlProvider.prop('messages')).toBe(messages);
    });

    test('should render the children component when initialized', () => {
        const wrapper = shallow(
            <Internationalize>
                <div className="content" />
            </Internationalize>,
        );

        const intlProvider = wrapper.find('IntlProvider');
        expect(intlProvider.length).toBe(0);
        expect(wrapper.contains(<div className="content" />)).toBeTruthy();
    });
});
