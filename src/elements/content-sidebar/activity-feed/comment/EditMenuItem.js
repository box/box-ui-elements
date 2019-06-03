/**
 * @flow
 * @file Inline Edit component
 */

import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import PlainButton from '../../../../components/plain-button';
import IconPencil from '../../../../icons/general/IconPencil';
import { MenuItem } from '../../../../components/menu';

import messages from '../../../common/messages';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';

type Props = {
    id: string,
    toEdit: Function,
} & InjectIntlProvidedProps;

class EditMenuItem extends React.Component<Props> {
    onEdit = (): void => {
        const { id, toEdit } = this.props;
        toEdit({ id });
    };

    render(): React.Node {
        const { onEdit } = this;
        return (
            <MenuItem>
                <div className="bcs-comment-edit-container">
                    <PlainButton
                        aria-label={this.props.intl.formatMessage(messages.editLabel)}
                        className="bcs-comment-edit"
                        data-resin-target={ACTIVITY_TARGETS.INLINE_EDIT}
                        onClick={onEdit}
                        type="button"
                    >
                        <IconPencil />
                        <FormattedMessage {...messages.editLabel} />
                    </PlainButton>
                </div>
            </MenuItem>
        );
    }
}

export { EditMenuItem as EditMenuItemBase };
export default injectIntl(EditMenuItem);
