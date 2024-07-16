/**
 * @flow
 * @file Classification add/edit button
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';
import PlainButton from '../../components/plain-button/PlainButton';

type Props = {
    className?: string,
    isEditing: boolean,
    onEdit: (e: SyntheticEvent<HTMLButtonElement>) => void,
};

const EditClassificationButton = ({ className = '', isEditing, onEdit, ...rest }: Props) => {
    const message = isEditing ? messages.edit : messages.add;
    const interaction = isEditing ? 'editclassification' : 'addclassification';
    return (
        <PlainButton
            className={`bdl-EditClassificationButton ${className}`}
            data-resin-target={interaction}
            onClick={onEdit}
            type="button"
            {...rest}
        >
            <FormattedMessage {...message} />
        </PlainButton>
    );
};

export default EditClassificationButton;
