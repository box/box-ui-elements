/**
 * @flow
 * @file Inline Edit component
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';

import PlainButton from 'components/plain-button';
import IconPencil from 'icons/general/IconPencil';

import messages from 'elements/common/messages';
import { ACTIVITY_TARGETS } from 'elements/common/interactionTargets';

type Props = {
    id: string,
    toEdit: Function,
} & InjectIntlProvidedProps;

class InlineEdit extends React.Component<Props> {
    onEdit = (): void => {
        const { id, toEdit } = this.props;
        toEdit({ id });
    };

    render(): React.Node {
        const { onEdit } = this;
        return (
            <div className="bcs-comment-edit-container">
                <PlainButton
                    aria-label={this.props.intl.formatMessage(messages.editLabel)}
                    className="bcs-comment-edit"
                    data-resin-target={ACTIVITY_TARGETS.INLINE_EDIT}
                    onClick={onEdit}
                    type="button"
                >
                    <IconPencil />
                </PlainButton>
            </div>
        );
    }
}

export { InlineEdit as InlineEditBase };
export default injectIntl(InlineEdit);
