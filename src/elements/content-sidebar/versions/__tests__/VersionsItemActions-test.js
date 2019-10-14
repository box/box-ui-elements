import * as React from 'react';
import { shallow } from 'enzyme/build';
import IconClockPast from '../../../../icons/general/IconClockPast';
import IconDownload from '../../../../icons/general/IconDownload';
import IconEllipsis from '../../../../icons/general/IconEllipsis';
import IconOpenWith from '../../../../icons/general/IconOpenWith';
import IconTrash from '../../../../icons/general/IconTrash';
import IconUpload from '../../../../icons/general/IconUpload';
import Tooltip from '../../../../components/tooltip/Tooltip';
import VersionsItemActions from '../VersionsItemActions';

describe('elements/content-sidebar/versions/VersionsItemActions', () => {
    const getWrapper = (props = {}) => shallow(<VersionsItemActions isDownloadable isPreviewable {...props} />);

    describe('render', () => {
        test.each([true, false])('should return the correct menu items based on options', option => {
            const wrapper = getWrapper({
                showDelete: option,
                showDownload: option,
                showPreview: option,
                showPromote: option,
                showRestore: option,
            });

            expect(wrapper.find(IconEllipsis).exists()).toBe(option); // Versions show actions if any permission is true
            expect(wrapper.find(IconClockPast).exists()).toBe(option);
            expect(wrapper.find(IconDownload).exists()).toBe(option);
            expect(wrapper.find(IconOpenWith).exists()).toBe(option);
            expect(wrapper.find(IconTrash).exists()).toBe(option);
            expect(wrapper.find(IconUpload).exists()).toBe(option);
            expect(wrapper).toMatchSnapshot();
        });

        test.each([true, false])('should enable/disable actions and tooltips if isRetained is %s', option => {
            const wrapper = getWrapper({
                isRetained: option,
                showDelete: true,
            });

            expect(wrapper.find(Tooltip).prop('isDisabled')).toBe(!option);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
