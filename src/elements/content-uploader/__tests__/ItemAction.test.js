import React from 'react';
import noop from 'lodash/noop';
import { shallow } from 'enzyme';
import PlainButton from '../../../components/plain-button';
import { ItemActionForTesting as ItemAction } from '../ItemAction';
import {
    ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED,
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_COMPLETE,
    STATUS_STAGED,
    STATUS_ERROR,
} from '../../../constants';

describe('elements/content-uploader/ItemAction', () => {
    const getWrapper = props =>
        shallow(
            <ItemAction
                intl={{ formatMessage: data => data.defaultMessage }}
                onClick={noop}
                status={STATUS_PENDING}
                {...props}
            />,
        );

    test.each`
        status
        ${STATUS_COMPLETE}
        ${STATUS_IN_PROGRESS}
        ${STATUS_STAGED}
        ${STATUS_ERROR}
        ${STATUS_PENDING}
    `('should render correctly with $status', ({ status }) => {
        const wrapper = shallow(
            <ItemAction intl={{ formatMessage: data => <span {...data} /> }} onClick={noop} status={status} />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test.each`
        status
        ${STATUS_COMPLETE}
        ${STATUS_IN_PROGRESS}
        ${STATUS_STAGED}
        ${STATUS_ERROR}
        ${STATUS_PENDING}
    `('should render correctly with $status and resumable uploads enabled', ({ status }) => {
        const wrapper = shallow(
            <ItemAction
                intl={{ formatMessage: data => <span {...data} /> }}
                onClick={noop}
                status={status}
                isResumableUploadsEnabled
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly with STATUS_ERROR and item is folder', () => {
        const wrapper = getWrapper({
            status: STATUS_ERROR,
            isFolder: true,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render PrimaryButton with STATUS_ERROR and upload file size exceeded', () => {
        const wrapper = getWrapper({
            status: STATUS_ERROR,
            error: { code: ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED },
            onUpgradeCTAClick: () => {},
        });

        expect(wrapper.exists('PrimaryButton')).toBe(true);
        expect(wrapper.exists('PlainButton')).toBe(false);
    });

    test('should have aria-label "Cancel this upload" when status is pending', () => {
        const wrapper = getWrapper({
            status: STATUS_PENDING,
        });
        const plainButton = wrapper.find(PlainButton);
        expect(plainButton.prop('aria-label')).toBe('Cancel this upload');
        expect(plainButton.prop('aria-describedby')).toBeFalsy();
    });
});
