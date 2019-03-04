// @flow
import * as React from 'react';

import Message from '../components/MetadataListViewMessage';
import { NEED_REFINING, TOO_MANY_RESULTS, NO_ACCESS_FOR_QUERY, NO_ACCESS_FOR_TEMPLATE } from '../constants';

describe('Message', () => {
    const getWrapper = (props = {}) => {
        return shallow(<Message {...props} />);
    };
    describe('render', () => {
        test.each`
            description                                      | message
            ${'should correctly render needRefining'}        | ${NEED_REFINING}
            ${'should correctly render tooManyResults'}      | ${TOO_MANY_RESULTS}
            ${'should correctly render noAccessForQuery'}    | ${NO_ACCESS_FOR_QUERY}
            ${'should correctly render noAccessForTemplate'} | ${NO_ACCESS_FOR_TEMPLATE}
        `('$description', ({ message }) => {
            const wrapper = getWrapper(message);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
