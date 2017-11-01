/* eslint-disable no-unused-expressions */

import React from 'react';
import { shallow } from 'enzyme';
import Internationalize from '../Internationalize';

const sandbox = sinon.sandbox.create();
const messages = {};

describe('components/Internationalize', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    it('should contains IntlProvider with correct props', () => {
        const wrapper = shallow(
            <Internationalize language='fr-CA' messages={messages}>
                <div className='content' />
            </Internationalize>
        );

        const intlProvider = wrapper.find('IntlProvider');
        expect(intlProvider.length, 1).to.equal(1);
        expect(intlProvider.prop('locale')).to.equal('fr');
        expect(intlProvider.prop('messages')).to.deep.equal(messages);
    });

    it('should render the children component when initialized', () => {
        const wrapper = shallow(
            <Internationalize>
                <div className='content' />
            </Internationalize>
        );

        const intlProvider = wrapper.find('IntlProvider');
        expect(intlProvider.length, 1).to.equal(0);
        expect(wrapper.contains(<div className='content' />)).to.be.true;
    });
});
