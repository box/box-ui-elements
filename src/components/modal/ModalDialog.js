// @flow
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import { defineMessages, injectIntl } from 'react-intl';

import IconClose from '../../icons/general/IconClose';

const ALERT_TYPE = 'alert';
const DIALOG_TYPE = 'dialog';

const messages = defineMessages({
    closeModalText: {
        defaultMessage: 'Close Modal',
        description: 'Button to close modal',
        id: 'boxui.modalDialog.closeModalText',
    },
});

type Props = {
    children: React.Node,
    className?: string,
    closeButtonProps: Object,
    intl: Object,
    modalRef?: Function,
    onRequestClose?: Function,
    title?: React.Node,
    type?: 'alert' | 'dialog',
};

class ModalDialog extends React.Component<Props> {
    static defaultProps = {
        type: DIALOG_TYPE,
        closeButtonProps: {},
    };

    /**
     * Handles clicking on the close button
     * @param {SyntheticMouseEvent} event
     * @return {void}
     */
    onCloseButtonClick = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
        const { onRequestClose } = this.props;
        if (onRequestClose) {
            onRequestClose(event);
        }
    };

    modalID: string = uniqueId('modal');

    /**
     * Renders a button if onRequestClose is passed in
     * @return {ReactElement|null} - Returns the button, or null if the button shouldn't be rendered
     */
    renderCloseButton() {
        const { closeButtonProps, onRequestClose, intl } = this.props;
        const { formatMessage } = intl;
        if (!onRequestClose) {
            return null;
        }

        return (
            // eslint-disable-next-line react/button-has-type
            <button
                {...closeButtonProps}
                aria-label={formatMessage(messages.closeModalText)}
                className="modal-close-button"
                onClick={this.onCloseButtonClick}
            >
                <IconClose color="#909090" height={18} width={18} />
            </button>
        );
    }

    renderContent() {
        const { children, type } = this.props;

        if (type !== ALERT_TYPE) {
            return <div className="modal-content">{children}</div>;
        }

        const elements = React.Children.toArray(children);
        if (elements.length !== 2) {
            throw new Error('Alert modal must have exactly two children: A message and <ModalActions>');
        }

        return (
            <div className="modal-content">
                <p id={`${this.modalID}-desc`}>{elements[0]}</p>
                {elements[1]}
            </div>
        );
    }

    render() {
        const {
            className,
            modalRef,
            title,
            type,
            ...rest // Useful for resin tagging, and other misc tags such as a11y
        } = this.props;
        const isAlertType = type === ALERT_TYPE;
        const divProps = omit(rest, ['children', 'closeButtonProps', 'onRequestClose', 'intl']);

        divProps.role = isAlertType ? 'alertdialog' : 'dialog';
        divProps['aria-labelledby'] = `${this.modalID}-label`;
        if (isAlertType) {
            divProps['aria-describedby'] = `${this.modalID}-desc`;
        }

        return (
            <div ref={modalRef} className={classNames('modal-dialog', className)} {...divProps}>
                <div className="modal-header">
                    <h2 className="modal-title" id={`${this.modalID}-label`}>
                        {title}
                    </h2>
                </div>
                {this.renderCloseButton()}
                {this.renderContent()}
            </div>
        );
    }
}

export { ModalDialog as ModalDialogBase };
export default injectIntl(ModalDialog);
