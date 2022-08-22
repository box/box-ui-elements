import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import Comment from '../../comment/Comment';
import AnnotationActivity from '../../annotations/AnnotationActivity';
import ActivityThread from '../ActivityThread.js';
import ActivityCard from '../../ActivityCard';

describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThread', () => {
    // eslint-disable-next-line flowtype/no-types-missing-file-annotation
    const getWrapper = (props = {}): ShallowWrapper => shallow(<ActivityThread {...props} />);

    test('should render Comment component if item.type is comment', () => {
        const item = { type: 'comment' };
        const wrapper = getWrapper({ item });

        expect(wrapper.find(ActivityCard)).toHaveLength(1);
        expect(wrapper.find(Comment)).toHaveLength(1);
        expect(wrapper.find(AnnotationActivity)).toHaveLength(0);
    });

    test('should render AnnotationActivity component if item.type is annotation', () => {
        const item = { type: 'annotation' };
        const wrapper = getWrapper({ item });

        expect(wrapper.find(ActivityCard)).toHaveLength(1);
        expect(wrapper.find(AnnotationActivity)).toHaveLength(1);
        expect(wrapper.find(Comment)).toHaveLength(0);
    });
});
