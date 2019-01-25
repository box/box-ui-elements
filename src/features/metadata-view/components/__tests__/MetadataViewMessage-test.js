// @flow
import * as React from 'react';

import Message from '../Message';

describe('Message', () => {
    const getWrapper = (props = {}) => {
        return shallow(<Message {...props} />);
    };
    describe('render', () => {
        [
            {
                description: 'should correctly render needRefining',
                message: 'needRefining',
            },
            {
                description: 'should correctly render tooManyResults',
                message: 'tooManyResults',
            },
            {
                description: 'should correctly render noAccessForQuery',
                message: 'noAccessForQuery',
            },
            {
                description: 'should correctly render noAccessForTemplate',
                message: 'noAccessForTemplate',
            },
        ].forEach(message => {
            test(`${message.description}`, () => {
                const wrapper = getWrapper(message);
                expect(wrapper).toMatchSnapshot();
            });
        });
    });
});
