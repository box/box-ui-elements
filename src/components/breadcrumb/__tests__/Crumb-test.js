/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import { Link } from '../../link';
import Crumb from '../Crumb';

let wrapper;

describe('components/breadcrumb/Crumb', () => {
    beforeEach(() => {
        wrapper = shallow(
            <Crumb className="my-crumb" isLastCrumb={false}>
                <Link>Home</Link>
            </Crumb>,
        );
    });

    test('should render correct crumb', () => {
        expect(wrapper.find('.breadcrumb-item').hasClass('my-crumb')).toBeTruthy();
        expect(wrapper.find('.breadcrumb-item').hasClass('breadcrumb-item-last')).toBeFalsy();
    });

    test('should render correct last crumb', () => {
        wrapper.setProps({
            isLastCrumb: true,
        });

        expect(wrapper.find('.breadcrumb-item').hasClass('breadcrumb-item-last')).toBeTruthy();
    });
});
