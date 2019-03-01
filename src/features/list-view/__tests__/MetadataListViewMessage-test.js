// @flow
import * as React from 'react';

import Message from '../components/MetadataListViewMessage';
import { NeedRefining, TooManyResults, NoAccessForQuery, NoAccessForTemplate } from '../constants';

describe('Message', () => {
    const getWrapper = (props = {}) => {
        return shallow(<Message {...props} />);
    };
    describe('render', () => {
        test.each`
            description                                      | message
            ${'should correctly render needRefining'}        | ${NeedRefining}
            ${'should correctly render tooManyResults'}      | ${TooManyResults}
            ${'should correctly render noAccessForQuery'}    | ${NoAccessForQuery}
            ${'should correctly render noAccessForTemplate'} | ${NoAccessForTemplate}
        `('$description', ({ message }) => {
            const wrapper = getWrapper(message);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
