// @flow
import * as React from 'react';

import Message from '../components/MetadataListViewMessage';
import { needRefining, tooManyResults, noAccessForQuery, noAccessForTemplate } from '../constants';

describe('Message', () => {
    const getWrapper = (props = {}) => {
        return shallow(<Message {...props} />);
    };
    describe('render', () => {
        test.each`
            description                                      | message
            ${'should correctly render needRefining'}        | ${needRefining}
            ${'should correctly render tooManyResults'}      | ${tooManyResults}
            ${'should correctly render noAccessForQuery'}    | ${noAccessForQuery}
            ${'should correctly render noAccessForTemplate'} | ${noAccessForTemplate}
        `('$description', ({ message }) => {
            const wrapper = getWrapper(message);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
