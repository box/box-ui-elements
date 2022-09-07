// @flow

import { mount } from 'enzyme';
import React from 'react';
import { AnnotationThreadContentComponent } from '../AnnotationThreadContent';
import { annotation } from '../../../__mocks__/annotations';
import ActivityThread from '../../content-sidebar/activity-feed/activity-feed/ActivityThread';
import AnnotationActivity from '../../content-sidebar/activity-feed/annotations';

describe('elements/annotation-thread/AnnotationThreadContent', () => {
    const runAllPromises = () => new Promise(setImmediate);

    const mockGetAvatarUrl = jest.fn();
    const fileCollaboratorsAPI = {
        getFileCollaborators: jest.fn(),
    };

    const mockFetchAnnotation = jest.fn().mockImplementation((fileId, annotationId, permissions, successCallback) => {
        successCallback(annotation);
    });
    const getAnnotationsAPI = {
        getAnnotation: mockFetchAnnotation,
    };

    const getUsersAPI = {
        getAvatarUrlWithAccessToken: mockGetAvatarUrl,
    };

    const api = {
        getFileCollaboratorsAPI: () => fileCollaboratorsAPI,
        getUsersAPI: () => getUsersAPI,
        getAnnotationsAPI: () => getAnnotationsAPI,
    };

    const defaultProps = {
        annotationId: '1',
        api,
        fileId: '1',
        filePermissions: {
            can_view_annotations: true,
            can_annotate: true,
        },
    };

    const getWrapper = (props = {}) => mount(<AnnotationThreadContentComponent {...defaultProps} {...props} />);

    test('Should render properly', () => {
        const wrapper = getWrapper();
        expect(wrapper.find(ActivityThread)).toHaveLength(1);
        expect(wrapper.find(AnnotationActivity)).toHaveLength(1);
    });

    test('should fetch annotation', async () => {
        getWrapper();

        expect(getAnnotationsAPI.getAnnotation).toBeCalled();
    });

    test('Should call getAvatarUrl with creator id', async () => {
        getWrapper();
        await runAllPromises();
        expect(mockGetAvatarUrl).toHaveBeenCalledWith('1', '1');
    });
});
