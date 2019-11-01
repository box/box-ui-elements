import * as React from 'react';

import IconWithTooltip from '../IconWithTooltip';

import messages from '../../../elements/common/messages';
import { CANCEL_ICON_TYPE, EDIT_ICON_TYPE, SAVE_ICON_TYPE } from '../constants';

describe('features/metadata-based-view/IconWithTooltip', () => {
    const getWrapper = props => shallow(<IconWithTooltip {...props} />);
    const onClick = () => {};

    test('should get IconClose with Tooltip having text "cancel"', () => {
        const props = {
            className: 'bdl-MetadataBasedItemList-cell--cancelIcon',
            onClick,
            tooltipText: messages.cancel,
            type: CANCEL_ICON_TYPE,
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });

    test('should get IconSave with Tooltip having text "save"', () => {
        const props = {
            className: 'bdl-MetadataBasedItemList-cell--saveIcon',
            onClick,
            tooltipText: messages.save,
            type: SAVE_ICON_TYPE,
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });

    test('should get IconPencil with Tooltip having text "edit"', () => {
        const props = {
            onClick,
            tooltipText: messages.editLabel,
            type: EDIT_ICON_TYPE,
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });
});
