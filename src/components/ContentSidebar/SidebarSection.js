/**
 * @flow
 * @file Preview sidebar section component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconCaretDown from 'box-react-ui/lib/icons/general/IconCaretDown';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import messages from '../messages';
import './SidebarSection.scss';

type Props = {
    children?: any,
    className: string,
    title?: string | React$Element<any>,
    isOpen: boolean,
    hasCustomBranding: boolean
};

type State = {
    isOpen: boolean
};

const CARET_HEIGHT = 5;
const CARET_COLOR = '5D5D5D';

class SidebarSection extends React.PureComponent<Props, State> {
    props: Props;
    state: State;

    static defaultProps = {
        className: '',
        isOpen: true
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ContentPreview}
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            isOpen: props.isOpen
        };
    }

    /**
     * Click handler for toggling the section
     *
     * @private
     * @param {Event} event - click event
     * @return {void}
     */
    toggleVisibility = () => {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen
        }));
    };

    /**
     * Gets the correct message for the title in IconCaretDown
     *
     * @private
     * @param {boolean} isOpen if the
     * @return the message for the title of the caret
     */
    getCaretMessage(isOpen: boolean): MessageDescriptor {
        return isOpen ? messages.caretOpen : messages.caretClosed;
    }

    /**
     * Renders the section
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    render() {
        const { isOpen }: State = this.state;
        const { children, className, title, hasCustomBranding }: Props = this.props;

        const sectionClassName = classNames(
            'bcs-section',
            {
                'bcs-section-open': isOpen,
                'bcs-section-has-custom-branding': hasCustomBranding
            },
            className
        );

        return (
            <section className={sectionClassName}>
                {title && (
                    <div
                        className='bcs-section-title'
                        aria-expanded={isOpen}
                        aria-label={title}
                        onClick={this.toggleVisibility}
                        onKeyPress={this.toggleVisibility}
                        role='button'
                        tabIndex={0}
                    >
                        <PlainButton type='button'>{title}</PlainButton>
                        <IconCaretDown
                            className='bcs-section-caret'
                            color={CARET_COLOR}
                            height={CARET_HEIGHT}
                            title={<FormattedMessage {...this.getCaretMessage(isOpen)} />}
                        />
                    </div>
                )}
                {(isOpen || !title) && <div className='bcs-section-content'>{children}</div>}
            </section>
        );
    }
}

export default SidebarSection;
