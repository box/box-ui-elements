/**
 * @flow
 * @file Inline Edit component
 */

import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';

import PlainButton from 'box-react-ui/lib/components/plain-button';
import IconPencil from 'box-react-ui/lib/icons/general/IconPencil';

import messages from '../messages';

type Props = {
    toEdit: Function,
    id: Function,
    intl: intlShape.isRequired
};

class InlineEdit extends Component<Props> {
    onEdit = () => {
        const { id, toEdit } = this.props;
        toEdit({ id });
    };

    render() {
        const { onEdit } = this;
        return (
            <div className='box-ui-comment-edit-container'>
                <PlainButton
                    aria-label={this.props.intl.formatMessage(messages.editLabel)}
                    className='box-ui-comment-edit'
                    onClick={onEdit}
                    type='button'
                >
                    <IconPencil />
                </PlainButton>
            </div>
        );
    }
}

export { InlineEdit as InlineEditBase };
export default injectIntl(InlineEdit);
