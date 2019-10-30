import * as React from 'react';

import IconWithTooltip from '../IconWithTooltip';

import messages from '../../../elements/common/messages';
import { CANCEL_ICON_TYPE, EDIT_ICON_TYPE, SAVE_ICON_TYPE } from '../constants';

describe('features/metadata-based-view/IconWithTooltip', () => {
    const getWrapper = props => shallow(<IconWithTooltip {...props} />);
    const onClick = () => {};

    test('get IconClose with Tooltip to cancel edited value', () => {
        const props = {
            className: 'bdl-MetadataBasedItemList-cell--cancelIcon',
            onClick,
            tooltipText: messages.cancel,
            type: CANCEL_ICON_TYPE,
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });

    test('get IconSave with Tooltip to save edited value', () => {
        const props = {
            className: 'bdl-MetadataBasedItemList-cell--saveIcon',
            onClick,
            tooltipText: messages.save,
            type: SAVE_ICON_TYPE,
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });

    test('get IconPencil with Tooltip to enter edit mode', () => {
        const props = {
            onClick,
            tooltipText: messages.editLabel,
            type: EDIT_ICON_TYPE,
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });
});
