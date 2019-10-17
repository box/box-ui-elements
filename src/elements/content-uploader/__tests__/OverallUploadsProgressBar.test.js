import React from 'react';
import noop from 'lodash/noop';
import { shallow } from 'enzyme';
import OverallUploadsProgressBar from '../OverallUploadsProgressBar';
import { VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS, VIEW_ERROR, VIEW_UPLOAD_EMPTY } from '../../../constants';

describe('elements/content-uploader/OverallUploadsProgressBar', () => {
    const getWrapper = props =>
        shallow(
            <OverallUploadsProgressBar
                isDragging={false}
                isExpanded
                isVisible
                onClick={noop}
                onKeyDown={noop}
                percent={2}
                view={VIEW_UPLOAD_EMPTY}
                {...props}
            />,
        );

    test('should render correctly when view is VIEW_UPLOAD_EMPTY', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly when view is VIEW_UPLOAD_SUCCESS', () => {
        const wrapper = getWrapper({
            view: VIEW_UPLOAD_SUCCESS,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly when view is VIEW_ERROR', () => {
        const wrapper = getWrapper({
            view: VIEW_ERROR,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly when view is VIEW_UPLOAD_IN_PROGRESS', () => {
        const wrapper = getWrapper({
            view: VIEW_UPLOAD_IN_PROGRESS,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly when isVisible is false', () => {
        const wrapper = getWrapper({
            isVisible: false,
            view: VIEW_UPLOAD_SUCCESS,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly when isDragging is true', () => {
        const wrapper = getWrapper({
            view: VIEW_UPLOAD_SUCCESS,
            isDragging: true,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly when isResumeVisible is false', () => {
        const wrapper = getWrapper({
            isResumeVisible: false,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly when isResumeVisible is true and hasMultipleFailedUploads is false', () => {
        const wrapper = getWrapper({
            isResumeVisible: true,
            hasMultipleFailedUploads: false,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly when isResumeVisible is true and hasMultipleFailedUploads is true', () => {
        const wrapper = getWrapper({
            isResumeVisible: true,
            hasMultipleFailedUploads: true,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
