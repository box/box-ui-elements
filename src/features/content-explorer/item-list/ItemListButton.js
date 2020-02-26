import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Checkbox from '../../../components/checkbox/Checkbox';
import { RadioButton } from '../../../components/radio';
import { ContentExplorerModePropType } from '../prop-types';
import ContentExplorerModes from '../modes';

import messages from '../messages';

const ItemListButton = ({ contentExplorerMode, id = '', isDisabled = false, isSelected = false, name }) => {
    if (contentExplorerMode === ContentExplorerModes.MULTI_SELECT) {
        return (
            <Checkbox
                hideLabel
                isChecked={!isDisabled && isSelected}
                isDisabled={isDisabled}
                label={<FormattedMessage {...messages.selectItem} values={{ name }} />}
                name="item"
                readOnly
                value={id}
            />
        );
    }
    return (
        <RadioButton
            hideLabel
            isDisabled={isDisabled}
            isSelected={!isDisabled && isSelected}
            label={<FormattedMessage {...messages.selectItem} values={{ name }} />}
            name="item"
            value={id}
        />
    );
};

ItemListButton.propTypes = {
    contentExplorerMode: ContentExplorerModePropType.isRequired,
    id: PropTypes.string,
    isDisabled: PropTypes.bool,
    isSelected: PropTypes.bool,
    name: PropTypes.string.isRequired,
};

export default ItemListButton;
