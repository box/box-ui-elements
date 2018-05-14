/**
 * @flow
 * @file Preview sidebar section component
 * @author Box
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconCaretDown from 'box-react-ui/lib/icons/general/IconCaretDown';
import { COLOR_999 } from '../../constants';
import './SidebarSection.scss';

type Props = {
    children?: any,
    className: string,
    title?: string | React$Element<any>,
    isOpen: boolean,
    interactionTarget?: string
};

type State = {
    isOpen: boolean
};

class SidebarSection extends PureComponent<Props, State> {
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
                'bcs-section-open': isOpen
            },
            className
        );

        return (
            <div className={sectionClassName}>
                {title && (
                    <PlainButton
                        type='button'
                        onClick={this.toggleVisibility}
                        className='bcs-section-title'
                        data-resin-target={interactionTarget}
                    >
                        {title}
                        <IconCaretDown color={COLOR_999} width={8} />
                    </PlainButton>
                )}
                {(isOpen || !title) && <div className='bcs-section-content'>{children}</div>}
            </div>
        );
    }
}

export default SidebarSection;
