// @deprecated, use Collapsible

/**
 * @flow
 * @file Preview sidebar section component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import PlainButton from '../../components/plain-button/PlainButton';
import IconCaretDown from '../../icons/general/IconCaretDown';
import { COLOR_999 } from '../../constants';
import './SidebarSection.scss';

type Props = {
    children?: any,
    className: string,
    interactionTarget?: string,
    isOpen: boolean,
    title?: string | React.Node,
};

type State = {
    isOpen: boolean,
};

class SidebarSection extends React.PureComponent<Props, State> {
    props: Props;

    state: State;

    static defaultProps = {
        className: '',
        isOpen: true,
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
            isOpen: props.isOpen,
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
        this.setState(prevState => ({
            isOpen: !prevState.isOpen,
        }));
    };

    /**
     * Renders the section
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    render() {
        const { isOpen }: State = this.state;
        const { children, className, title, interactionTarget }: Props = this.props;

        const sectionClassName = classNames(
            'bcs-section',
            {
                'bcs-section-open': isOpen,
            },
            className,
        );

        return (
            <div className={sectionClassName}>
                {title && (
                    <PlainButton
                        aria-expanded={isOpen}
                        className="bcs-section-title"
                        data-resin-target={interactionTarget}
                        onClick={this.toggleVisibility}
                        type="button"
                    >
                        {title}
                        <IconCaretDown color={COLOR_999} width={8} />
                    </PlainButton>
                )}
                {(isOpen || !title) && <div className="bcs-section-content">{children}</div>}
            </div>
        );
    }
}

export default SidebarSection;
