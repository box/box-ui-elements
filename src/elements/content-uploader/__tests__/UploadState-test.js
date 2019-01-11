import React from 'react';
import noop from 'lodash/noop';
import { shallow } from 'enzyme';
import UploadState from '../UploadState';
import { VIEW_ERROR, VIEW_UPLOAD_EMPTY, VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS } from '../../../constants';

describe('elements/content-uploader/UploadState', () => {
    const getWrapper = props =>
        shallow(
            <UploadState
                {...{
                    ...{
                        canDrop: false,
                        hasItems: false,
                        isOver: false,
                        isTouch: false,
                        view: VIEW_ERROR,
                        onSelect: noop,
                        isFolderUploadEnabled: false,
                    },
                    ...props,
                }}
            />,
        );

    test('should render VIEW_ERROR correctly', () => {
        const wrapper = getWrapper({
            view: VIEW_ERROR,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render VIEW_UPLOAD_EMPTY correctly', () => {
        const wrapper = getWrapper({
            view: VIEW_UPLOAD_EMPTY,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render VIEW_UPLOAD_EMPTY correctly when folder upload is enabled', () => {
        const wrapper = getWrapper({
            view: VIEW_UPLOAD_EMPTY,
            isFolderUploadEnabled: true,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render VIEW_UPLOAD_IN_PROGRESS correctly', () => {
        const wrapper = getWrapper({
            view: VIEW_UPLOAD_IN_PROGRESS,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render VIEW_UPLOAD_SUCCESS correctly', () => {
        const wrapper = getWrapper({
            view: VIEW_UPLOAD_SUCCESS,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render VIEW_UPLOAD_SUCCESS correctly  when folder upload is enabled', () => {
        const wrapper = getWrapper({
            view: VIEW_UPLOAD_SUCCESS,
            isFolderUploadEnabled: true,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
