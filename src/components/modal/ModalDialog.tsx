import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import { defineMessages, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import IconBack from '../../icon/fill/Arrow16';
import IconClose from '../../icon/fill/X16';

const ALERT_TYPE = 'alert' as const;
const DIALOG_TYPE = 'dialog' as const;

const messages = defineMessages({
    backModalText: {
        defaultMessage: 'Back',
        description: 'Button to get back inside modal',
        id: 'boxui.modalDialog.backModalText',
    },
    closeModalText: {
        defaultMessage: 'Close Modal',
        description: 'Button to close modal',
        id: 'boxui.modalDialog.closeModalText',
    },
});

export interface ModalDialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Contents of the modal dialog */
    children: React.ReactNode;
    /** Additional CSS class name for the modal dialog */
    className?: string;
    /** Props applied to the close button */
    closeButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
    /** Internationalization object used to format accessible button labels */
    intl: IntlShape;
    /** Ref callback for the modal dialog element */
    modalRef?: React.Ref<HTMLDivElement>;
    /** Handler called when the back button is clicked */
    onRequestBack?: React.MouseEventHandler<HTMLButtonElement>;
    /** Handler called when the close button is clicked */
    onRequestClose?: React.MouseEventHandler<HTMLButtonElement>;
    /** Title displayed in the modal header */
    title?: React.ReactNode;
    /** Dialog semantics used for accessibility */
    type?: 'alert' | 'dialog';
}

class ModalDialog extends React.Component<ModalDialogProps> {
    static defaultProps = {
        type: DIALOG_TYPE,
        closeButtonProps: {},
    };

    /**
     * Handles clicking on the back button
     * @param {SyntheticMouseEvent} event
     * @return {void}
     */
    onBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { onRequestBack } = this.props;
        if (onRequestBack) {
            onRequestBack(event);
        }
    };

    /**
     * Handles clicking on the close button
     * @param {SyntheticMouseEvent} event
     * @return {void}
     */
    onCloseButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { onRequestClose } = this.props;
        if (onRequestClose) {
            onRequestClose(event);
        }
    };

    modalID: string = uniqueId('modal');

    /**
     * Renders a button if onRequestBack is passed in
     * @return {ReactElement|null} - Returns the button, or null if the button shouldn't be rendered
     */
    renderBackButton() {
        const { intl } = this.props;
        const { formatMessage } = intl;
        return (
            <button
                aria-label={formatMessage(messages.backModalText)}
                className="modal-back-button"
                data-testid="modal-back-button"
                onClick={this.onBackButtonClick}
                type="button"
            >
                <IconBack height={18} width={18} />
            </button>
        );
    }

    /**
     * Renders a button if onRequestClose is passed in
     * @return {ReactElement|null} - Returns the button, or null if the button shouldn't be rendered
     */
    renderCloseButton() {
        const { closeButtonProps, intl } = this.props;
        const { formatMessage } = intl;

        return (
            <button
                {...closeButtonProps}
                aria-label={formatMessage(messages.closeModalText)}
                className="modal-close-button"
                onClick={this.onCloseButtonClick}
            >
                <IconClose height={18} width={18} />
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
            onRequestBack,
            onRequestClose,
            title,
            type,
            ...rest // Useful for resin tagging, and other misc tags such as a11y
        } = this.props;
        const isAlertType = type === ALERT_TYPE;
        const divProps = omit(rest, [
            'children',
            'closeButtonProps',
            'onRequestClose',
            'intl',
        ]) as React.HTMLAttributes<HTMLDivElement>;

        divProps.role = isAlertType ? 'alertdialog' : 'dialog';
        divProps['aria-modal'] = true;
        divProps['aria-labelledby'] = `${this.modalID}-label`;
        if (isAlertType) {
            divProps['aria-describedby'] = `${this.modalID}-desc`;
        }

        return (
            <div ref={modalRef} className={classNames('modal-dialog', className)} {...divProps}>
                <div className="modal-header-container">
                    <div className="modal-header">
                        {onRequestBack && this.renderBackButton()}
                        <h2 className="modal-title" id={`${this.modalID}-label`}>
                            {title}
                        </h2>
                    </div>
                    {onRequestClose && this.renderCloseButton()}
                </div>
                {this.renderContent()}
            </div>
        );
    }
}

export { ModalDialog as ModalDialogBase };

export type InjectedModalDialogProps = Omit<ModalDialogProps, 'closeButtonProps' | 'intl'> &
    Partial<Pick<ModalDialogProps, 'closeButtonProps'>>;

export default injectIntl(ModalDialog) as React.ComponentType<InjectedModalDialogProps>;
