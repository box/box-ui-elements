import React from 'react';
import { shallow } from 'enzyme';
import noop from 'lodash/noop';
import Button from '../../../components/button/Button';
import Footer from '../Footer';
import PrimaryButton from '../../../components/primary-button/PrimaryButton';

describe('elements/content-uploader/Footer', () => {
    const defaultProps = {
        fileLimit: 10,
        hasFiles: false,
        isDone: false,
        isLoading: false,
        onCancel: noop,
        onUpload: noop,
    };
    const getWrapper = (props = {}) => shallow(<Footer {...defaultProps} {...props} />);

    test.each`
        hasFiles | isDone   | isDisabled
        ${true}  | ${false} | ${false}
        ${false} | ${true}  | ${true}
        ${false} | ${false} | ${true}
        ${true}  | ${true}  | ${true}
    `(
        'cancel button disabled props should be $isDisabled when hasFiles is $hasFiles and isDone is $isDone',
        ({ hasFiles, isDone, isDisabled }) => {
            const wrapper = getWrapper({ hasFiles, isDone });
            const closeButton = wrapper.find(Button);

            expect(closeButton.prop('disabled')).toBe(isDisabled);
            expect(closeButton.prop('isDisabled')).toBe(isDisabled);
        },
    );

    test.each`
        hasFiles | isDisabled
        ${true}  | ${false}
        ${false} | ${true}
    `('upload button disabled props should be $isDisabled when hasFiles is $hasFiles', ({ hasFiles, isDisabled }) => {
        const wrapper = getWrapper({ hasFiles });
        const uploadButton = wrapper.find(PrimaryButton);

        expect(uploadButton.prop('disabled')).toBe(isDisabled);
        expect(uploadButton.prop('isDisabled')).toBe(isDisabled);
    });

    test.each`
        hasFiles | isDisabled
        ${true}  | ${true}
        ${false} | ${false}
    `('close button disabled props should be $isDisabled when hasFiles is $hasFiles', ({ hasFiles, isDisabled }) => {
        const wrapper = getWrapper({ hasFiles, onClose: noop });
        const closeButton = wrapper.find(Button).at(0);

        expect(closeButton.prop('disabled')).toBe(isDisabled);
        expect(closeButton.prop('isDisabled')).toBe(isDisabled);
    });
});
