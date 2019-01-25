import React from 'react';
import sinon from 'sinon';

import AllowDownloadSection from '../AllowDownloadSection';

const sandbox = sinon.sandbox.create();

describe('features/shared-link-settings-modal/AllowDownloadSection', () => {
    const isDownloadAvailable = true;
    const canChangeDownload = true;
    const isDownloadEnabled = true;

    const directLink = 'box.com/download';
    const isDirectLinkAvailable = true;
    const isDirectLinkUnavailableDueToDownloadSettings = true;

    const getWrapper = (props = {}) =>
        shallow(
            <AllowDownloadSection
                isDownloadAvailable={isDownloadAvailable}
                canChangeDownload={canChangeDownload}
                isDownloadEnabled={isDownloadEnabled}
                directLink={directLink}
                isDirectLinkAvailable={isDirectLinkAvailable}
                isDirectLinkUnavailableDueToDownloadSettings={isDirectLinkUnavailableDueToDownloadSettings}
                onChange={sandbox.stub()}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('isDownloadAvailable === true', () => {
        test('should render a Fieldset with Checkbox', () => {
            const wrapper = getWrapper({
                onChange: sandbox.mock(),
            });

            expect(wrapper.find('Fieldset').length).toBe(1);

            const checkbox = wrapper.find('Checkbox');
            expect(checkbox.length).toBe(1);
            expect(checkbox.prop('isChecked')).toBe(true);
            checkbox.simulate('change');
        });

        test('should disable Checkbox when canChangeDownload is false', () => {
            const wrapper = getWrapper({ canChangeDownload: false });

            expect(wrapper.find('Checkbox').prop('isDisabled')).toBe(true);
        });

        test('should render a TextInputWithCopyButton when direct link and download are enabled', () => {
            const wrapper = getWrapper();

            const textInput = wrapper.find('TextInputWithCopyButton');
            expect(textInput.length).toBe(1);
            expect(textInput.prop('value')).toEqual(directLink);
        });

        test('should pass passthrough props', () => {
            const wrapper = getWrapper({
                downloadCheckboxProps: { 'data-prop': 'checkbox' },
                directLinkInputProps: { 'data-prop': 'input' },
            });

            expect(wrapper.find('Checkbox').prop('data-prop')).toEqual('checkbox');
            expect(wrapper.find('TextInputWithCopyButton').prop('data-prop')).toEqual('input');
        });

        test('should not render a TextInputWithCopyButton when download is disabled', () => {
            const wrapper = getWrapper({ isDownloadEnabled: false });

            expect(wrapper.find('TextInputWithCopyButton').length).toBe(0);
        });
    });

    describe('isDownloadAvailable === false', () => {
        test('should return null when direct link is not available', () => {
            const wrapper = getWrapper({
                isDownloadAvailable: false,
                isDirectLinkAvailable: false,
            });

            expect(wrapper.type()).toBeNull();
        });

        test('should render a TextInputWithCopyButton when direct link is available', () => {
            const wrapper = getWrapper({
                isDownloadAvailable: false,
                isDirectLinkAvailable: true,
            });

            expect(wrapper.find('TextInputWithCopyButton').length).toBe(1);
        });
    });
});
