import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';

import PlainButton from '../../../components/plain-button';
import IconPencil from '../../../icons/general/IconPencil';
import messages from '../messages';

class InlineEdit extends Component {
    static propTypes = {
        toEdit: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        intl: intlShape.isRequired
    };

    onEdit = () => {
        const { id, toEdit } = this.props;
        toEdit({ id });
    };

    render() {
        const onEdit = this.onEdit;
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
