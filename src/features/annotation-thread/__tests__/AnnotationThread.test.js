// @flow

import { mount } from 'enzyme';
import React from 'react';
import AnnotationThread from '../AnnotationThread';
import AnnotationThreadContent from '../AnnotationThreadContent';

describe('elements/annotation-thread/AnnotationThread', () => {
    const getWrapper = (props = {}) => mount(<AnnotationThread {...props} />);

    test('should not render if annotationId is undefined', async () => {
        const wrapper = getWrapper();

        expect(wrapper.find(AnnotationThreadContent)).toHaveLength(0);
    });

    test('should render properly', () => {
        const wrapper = getWrapper({ annotationId: '1' });
        expect(wrapper.find(AnnotationThreadContent)).toHaveLength(1);
    });
});
