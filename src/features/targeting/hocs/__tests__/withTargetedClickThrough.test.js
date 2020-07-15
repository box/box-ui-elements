// @flow
import React from 'react';
import { shallow } from 'enzyme';

import withTargetedClickThrough from '../withTargetedClickThrough';

const onClose = jest.fn();
const onComplete = jest.fn();
const onShow = jest.fn();

describe('features/targeting/hocs/withTargetedClickThrough', () => {
    const WrappedComponent = () => <div />;
    const WrapperComponent = withTargetedClickThrough(WrappedComponent);
    const useDefaultTargetingApi = () => ({
        canShow: true,
        onClose,
        onComplete,
        onShow,
    });

    const getWrapper = (props = {}) =>
        shallow(
            <WrapperComponent closeOnClickOutside shouldTarget useTargetingApi={useDefaultTargetingApi} {...props} />,
        );

    describe('render()', () => {
        test('should render wrapped component with pass through props', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
